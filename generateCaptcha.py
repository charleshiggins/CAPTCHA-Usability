from captcha.audio import AudioCaptcha
from captcha.image import ImageCaptcha
import random, string
randomString = ''.join(random.choices(string.ascii_letters + string.digits, k=5))

image = ImageCaptcha(fonts=['./Roboto-Regular.ttf'])

data = image.generate(randomString)
image.write(randomString, randomString + '.png')