import torch
from torch import nn, optim
from torch.utils.data import DataLoader, random_split
from datasets.div2k_denoising import DIV2KDenoisingDataset
from dncnn_model import DnCNN
import os

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
os.makedirs("checkpoints", exist_ok=True)

EPOCHS = 50  
BATCH_SIZE = 16
LR = 1e-3
VAL_SPLIT = 0.1

full_dataset = DIV2KDenoisingDataset("data/DIV2K_train_HR/DIV2K_train_HR", patch_size=128)
val_len = int(len(full_dataset) * VAL_SPLIT)
train_len = len(full_dataset) - val_len
train_set, val_set = random_split(full_dataset, [train_len, val_len])
train_loader = DataLoader(train_set, batch_size=BATCH_SIZE, shuffle=True)
val_loader = DataLoader(val_set, batch_size=BATCH_SIZE, shuffle=False)

model = DnCNN(channels=3).to(device)
criterion = nn.MSELoss()
optimizer = optim.Adam(model.parameters(), lr=LR)

best_val_loss = float('inf')
for epoch in range(EPOCHS):
    model.train()
    total_train_loss = 0
    for batch_idx, (noisy, clean) in enumerate(train_loader):
        noisy, clean = noisy.to(device), clean.to(device)
        optimizer.zero_grad()
        output = model(noisy)
        loss = criterion(output, clean)
        loss.backward()
        optimizer.step()
        total_train_loss += loss.item()

        if batch_idx % 10 == 0:
            print(f"[Epoch {epoch+1}/{EPOCHS}] Batch {batch_idx}/{len(train_loader)} - Train Loss: {loss.item():.6f}")

    avg_train_loss = total_train_loss / len(train_loader)

    model.eval()
    total_val_loss = 0
    with torch.no_grad():
        for noisy, clean in val_loader:
            noisy, clean = noisy.to(device), clean.to(device)
            output = model(noisy)
            loss = criterion(output, clean)
            total_val_loss += loss.item()
    avg_val_loss = total_val_loss / len(val_loader)

    print(f"\n>>> Epoch {epoch+1}/{EPOCHS} completed | Train Loss: {avg_train_loss:.6f} | Val Loss: {avg_val_loss:.6f}")

    if avg_val_loss < best_val_loss:
        best_val_loss = avg_val_loss
        torch.save(model.state_dict(), "dncnn_rgb.pth")
        print(f">>> ✅ Best model updated at epoch {epoch+1}")

    if (epoch + 1) % 10 == 0:
        torch.save(model.state_dict(), f"checkpoints/dncnn_epoch{epoch+1}.pth")
        print(f">>> 💾 Checkpoint saved at epoch {epoch+1}")
