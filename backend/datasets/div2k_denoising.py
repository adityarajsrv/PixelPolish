from torch.utils.data import Dataset
from torchvision import transforms
from PIL import Image
import os
import random
import torch

class DIV2KDenoisingDataset(Dataset):
    def __init__(self, root_dir, patch_size=128, noise_std_range=(5, 50)):
        self.root_dir = root_dir
        self.filenames = [f for f in os.listdir(root_dir) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
        self.patch_size = patch_size
        self.noise_std_range = noise_std_range
        self.transform = transforms.Compose([
            transforms.RandomCrop(patch_size),
            transforms.ToTensor()
        ])

    def __len__(self):
        return len(self.filenames)

    def __getitem__(self, idx):
        img_path = os.path.join(self.root_dir, self.filenames[idx])
        image = Image.open(img_path).convert('RGB')

        clean = self.transform(image)

        noise_std = random.uniform(*self.noise_std_range) / 255.0
        noise = torch.randn_like(clean) * noise_std
        noisy = torch.clamp(clean + noise, 0., 1.)

        return noisy, clean
