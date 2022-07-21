import torch
import cv2
import numpy as np
import torchvision.models as models
import torch.nn as nn
from resnet34 import resnet34
import os
from numpy import random

def drawing_classifier(img_path):
        seed = 42
        torch.manual_seed(seed)
        torch.cuda.manual_seed_all(seed)
        torch.backends.cudnn.deterministic = True
        torch.backends.cudnn.benchmark = False
        np.random.seed(seed)
        random.seed(seed)
        os.environ['PYTHONHASHSEED'] = str(seed)

        img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)

        # getting list of class names from text file
        with open('../assets/class_names.txt', 'r') as f:
                classes = f.readlines()

        classes = np.array(classes)

        model = resnet34(numclasses=345, pretrained=False)
        model.load_state_dict(torch.load('./models/model_75_2.pt', map_location=torch.device('cpu')), strict=True)
        model.eval()

        with torch.no_grad():
                # img = cv2.bitwise_not(img)
                img = cv2.resize(img, (28, 28), interpolation=cv2.INTER_AREA)
                # img = cv2.adaptiveThreshold(img,255,cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY,11,2)
                img = torch.from_numpy(img)
                img = torch.reshape(img, (1, 1, 28, 28))

                img = img/255
                out_data = model(img)

                img = np.array(img[0][0][:][:])

                # cv2.imshow('img', img)
                # cv2.waitKey(0)
                # cv2.destroyAllWindows()

                #applying softmax to get probabilities
                out_data = torch.nn.functional.softmax(out_data, dim=1)
                print(out_data)

                # certainty = round(torch.max(out_data).item(), 4)
                # pred = classes[torch.argmax(out_data)]

                # finding top 3 classes and their probabilities
                pred = classes[out_data.topk(3, 1)[1]]
                certainty = out_data.topk(3, 1)[0]

                # print(certainty.flatten().tolist())
                print(torch.argmax(out_data))

        return pred, certainty

if __name__ == '__main__':
        # path = './images/golf_club.png'
        path = './images/face.jpg'

        # cv2.imshow('img', cv2.imread(path))
        # cv2.waitKey(0)

        pred, certainty = drawing_classifier(path)
        print(pred, certainty)
        # for path in os.listdir('./images'):
                # print(path)
                # # cv2.imshow('img', cv2.imread('./' + path))
                # # cv2.waitKey(0)
                # pred, certainty = drawing_classifier('./' + path)
                # print(pred, certainty)