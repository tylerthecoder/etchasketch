import torch
import torchvision.models as models
import torch.nn as nn

# class resnet34(nn.Module):
#     def __init__(self, numclasses, pretrained):
#         super().__init__()
        
#         self.model = models.resnet34(pretrained=pretrained)
        
#         conv1_out_channels = self.model.conv1.out_channels
#         self.model.conv1 = nn.Conv2d(1, conv1_out_channels, kernel_size=3, stride=1, padding=1, bias=False)
#         self.model.maxpool = nn.MaxPool2d(kernel_size=2)
#         fc_features = self.model.fc.in_features
#         self.model.fc = nn.Linear(fc_features, numclasses)
        

def resnet34(numclasses, pretrained=True):
    model = models.resnet34(pretrained)
    conv1_out_channels = model.conv1.out_channels
    model.conv1 = nn.Conv2d(1, conv1_out_channels, kernel_size=3, stride=1, padding=1, bias=False)
    model.maxpool = nn.MaxPool2d(kernel_size=2)
    fc_features = model.fc.in_features
    model.fc = nn.Linear(fc_features, numclasses)
    
    return model
    
    # def forward(self, x: torch.Tensor) -> torch.Tensor:
    #     model_output = self.model(x)
        
    #     return model_output