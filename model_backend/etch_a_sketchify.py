import numpy as np
import cv2
from matplotlib import pyplot as plt

def auto_canny(photo, sigma=0.01, k_size=21):
    median = np.mean(photo)
    lower = int(max(0, (1.0 - sigma) * median))
    upper = int(min(255, (1.0 + sigma) * median))
    edged = cv2.Canny(photo, lower, upper)
    edged = cv2.bitwise_not(edged)  
    edged = cv2.GaussianBlur(edged, (k_size, k_size),0)
    
    return edged

def sketchify(path, k_size):
    photo = cv2.imread(path,0)
    photo = auto_canny(photo=photo, k_size=k_size)
    # photo = cv2.threshold(photo, 0, 50, cv2.THRESH_BINARY_INV)[1]
    photo = cv2.adaptiveThreshold(photo,255,cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY,11,2)
    photo = cv2.bitwise_not(photo)
    photo = cv2.resize(photo, (28, 28), interpolation=cv2.INTER_AREA)
    
    
    return photo


if __name__ == '__main__':   
    # edges = sketchify('froggy.png', k_size=11)
    # edges = sketchify('light_bulb.jpg', k_size=21)
    # edges = sketchify('coffin3.jpg', k_size=3)
    edges = sketchify('Sofas.jpg', k_size=11)
    
    # saving image
    cv2.imwrite('couch_sketch.jpg', edges)
    
    plt.imshow(edges,cmap='gray')
    plt.show()