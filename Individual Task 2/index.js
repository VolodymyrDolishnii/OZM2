let chartRGB, chartRed, chartGreen, chartBlue, chartERGB, chartERed, chartEGreen, chartEBlue = {};

const imageList = document.querySelectorAll('.image-variant input');
const container = document.querySelectorAll('.image-container');
const image = new Image();
image.src = './sample.bmp';
image.className = 'default-image';

const equalizedImage = new Image();
equalizedImage.src = './output.png';

renderCharts();
activeImage();
renderECharts();

container[0].appendChild(image);
// equalizedImage.height = image.height;
// equalizedImage.width = image.width;

function renderCharts() {
    image.onload = function () {
        const { redHistogram, greenHistogram, blueHistogram } = getImageHistograms(image);
        // const { redHistogram, greenHistogram, blueHistogram } = getImageHistograms(equalizedImage);
        const ctx = document.getElementById('histogramCanvas').getContext('2d');
        chartRGB = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Array.from({ length: 256 }, (_, i) => i),
                datasets: [
                    {
                        label: 'Red Channel',
                        data: redHistogram,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                    },
                    {
                        label: 'Green Channel',
                        data: greenHistogram,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    },
                    {
                        label: 'Blue Channel',
                        data: blueHistogram,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                    },
                    y: {
                        type: 'linear',
                        position: 'left',
                    },
                },
            },
        });

        // Створення гістограм за допомогою Chart.js
        const ctxRed = document.getElementById('histogramCanvasRed').getContext('2d');
        chartRed = new Chart(ctxRed, {
            type: 'bar',
            data: {
                labels: Array.from({ length: 256 }, (_, i) => i),
                datasets: [{
                    label: 'Red Channel',
                    data: redHistogram,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom'
                    },
                    y: {
                        type: 'linear',
                        position: 'left'
                    }
                }
            }
        });

        const ctxGreen = document.getElementById('histogramCanvasGreen').getContext('2d');
        chartGreen = new Chart(ctxGreen, {
            type: 'bar',
            data: {
                labels: Array.from({ length: 256 }, (_, i) => i),
                datasets: [{
                    label: 'Green Channel',
                    data: greenHistogram,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom'
                    },
                    y: {
                        type: 'linear',
                        position: 'left'
                    }
                }
            }
        });

        const ctxBlue = document.getElementById('histogramCanvasBlue').getContext('2d');
        chartBlue = new Chart(ctxBlue, {
            type: 'bar',
            data: {
                labels: Array.from({ length: 256 }, (_, i) => i),
                datasets: [{
                    label: 'Blue Channel',
                    data: blueHistogram,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom'
                    },
                    y: {
                        type: 'linear',
                        position: 'left'
                    }
                }
            }
        });

        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;

        const ctx2 = canvas.getContext('2d');
        ctx2.drawImage(image, 0, 0, image.width, image.height);

        const imageData = ctx2.getImageData(0, 0, image.width, image.height).data;

        equalizeImage(imageData);

        ctx2.putImageData(new ImageData(imageData, image.width, image.height), 0, 0);

        const equalizedImageData = new ImageData(imageData, image.width, image.height);
        ctx.putImageData(equalizedImageData, 0, 0);
        const equalizedImageDataURL = canvas.toDataURL();
        const imageUrl = base64ToImage(equalizedImageDataURL);
        // saveImage(imageUrl, "output.png");

        if (!document.getElementById('equalized')) {
            const base64Image = document.createElement('img');
            base64Image.src = imageUrl;
            base64Image.id = 'equalized';

            container[1].appendChild(base64Image);
        } else {
            document.getElementById('equalized').src = imageUrl;
        }

        const imgCanvas = document.createElement("canvas");
        const imgContext = imgCanvas.getContext("2d");

        imgCanvas.width = image.width;
        imgCanvas.height = image.height;

        // Draw image into canvas element
        imgContext.drawImage(image, 0, 0, image.width, image.height);

        const imageDataOriginal = imgContext.getImageData(0, 0, image.width, image.height);

        // Застосовуємо оператор Робертса
        const robertsImageData = applyRobertsOperator(imageDataOriginal);

        // Відображення еквалізованого зображення на сторінці
        const canvasRoberts = document.getElementById('robertsCanvas');
        const ctxRoberts = canvasRoberts.getContext('2d');

        ctxRoberts.putImageData(robertsImageData, 0, 0);

        const imgCanvas2 = document.createElement("canvas");
        const imgContext2 = imgCanvas2.getContext("2d");

        imgCanvas2.width = image.width;
        imgCanvas2.height = image.height;
        imgContext2.drawImage(image, 0, 0, image.width, image.height);

        const imageDataOriginal2 = imgContext2.getImageData(0, 0, image.width, image.height);

        // Застосовуємо оператор Превіта
        const prewittImageData = applyPrewittOperator(imageDataOriginal2);

        // Відображення фільтрованого зображення на сторінці
        const canvasPrewitt = document.getElementById('prewittCanvas');
        const ctxPrewitt = canvasPrewitt.getContext('2d');

        ctxPrewitt.putImageData(prewittImageData, 0, 0);

        const canvasOriginal = document.createElement("canvas");
        const ctxOriginal = canvasOriginal.getContext('2d');
        canvasOriginal.width = image.width;
        canvasOriginal.height = image.height;
        ctxOriginal.drawImage(image, 0, 0, image.width, image.height);

        const imageDataOriginal3 = ctxOriginal.getImageData(0, 0, image.width, image.height);

        // Застосовуємо оператор Собела
        const sobelImageData = applySobelOperator(imageDataOriginal3);

        // Відображення фільтрованого зображення на сторінці
        const canvasSobel = document.getElementById('sobelCanvas');
        const ctxSobel = canvasSobel.getContext('2d');

        ctxSobel.putImageData(sobelImageData, 0, 0);
    };
}

function renderECharts() {
    equalizedImage.onload = function () {
        const { redHistogram, greenHistogram, blueHistogram } = getImageHistograms(equalizedImage);
        const ctx = document.getElementById('histogramECanvas').getContext('2d');
        chartERGB = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Array.from({ length: 256 }, (_, i) => i),
                datasets: [
                    {
                        label: 'Red Channel',
                        data: redHistogram,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                    },
                    {
                        label: 'Green Channel',
                        data: greenHistogram,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    },
                    {
                        label: 'Blue Channel',
                        data: blueHistogram,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                    },
                    y: {
                        type: 'linear',
                        position: 'left',
                    },
                },
            },
        });

        // Створення гістограм за допомогою Chart.js
        const ctxRed = document.getElementById('histogramECanvasRed').getContext('2d');
        chartERed = new Chart(ctxRed, {
            type: 'bar',
            data: {
                labels: Array.from({ length: 256 }, (_, i) => i),
                datasets: [{
                    label: 'Red Channel',
                    data: redHistogram,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom'
                    },
                    y: {
                        type: 'linear',
                        position: 'left'
                    }
                }
            }
        });

        const ctxGreen = document.getElementById('histogramECanvasGreen').getContext('2d');
        chartEGreen = new Chart(ctxGreen, {
            type: 'bar',
            data: {
                labels: Array.from({ length: 256 }, (_, i) => i),
                datasets: [{
                    label: 'Green Channel',
                    data: greenHistogram,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom'
                    },
                    y: {
                        type: 'linear',
                        position: 'left'
                    }
                }
            }
        });

        const ctxBlue = document.getElementById('histogramECanvasBlue').getContext('2d');
        chartEBlue = new Chart(ctxBlue, {
            type: 'bar',
            data: {
                labels: Array.from({ length: 256 }, (_, i) => i),
                datasets: [{
                    label: 'Blue Channel',
                    data: blueHistogram,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom'
                    },
                    y: {
                        type: 'linear',
                        position: 'left'
                    }
                }
            }
        });

        const eImgCanvas = document.createElement("canvas");
        const eImgContext = eImgCanvas.getContext("2d");

        eImgCanvas.width = equalizedImage.width;
        eImgCanvas.height = equalizedImage.height;

        eImgContext.drawImage(equalizedImage, 0, 0, equalizedImage.width, equalizedImage.height);

        const eImageDataOriginal = eImgContext.getImageData(0, 0, equalizedImage.width, equalizedImage.height);
        const eRobertsImageData = applyRobertsOperator(eImageDataOriginal);
        const eCanvasRoberts = document.getElementById('robertsECanvas');
        const eCtxRoberts = eCanvasRoberts.getContext('2d');

        eCtxRoberts.putImageData(eRobertsImageData, 0, 0);

        const eImgCanvas2 = document.createElement("canvas");
        const eImgContext2 = eImgCanvas2.getContext("2d");

        eImgCanvas2.width = image.width;
        eImgCanvas2.height = image.height;
        eImgContext2.drawImage(equalizedImage, 0, 0, equalizedImage.width, equalizedImage.height);

        const imageDataOriginal2 = eImgContext2.getImageData(0, 0, equalizedImage.width, equalizedImage.height);

        // Застосовуємо оператор Превіта
        const ePrewittImageData = applyPrewittOperator(imageDataOriginal2);

        // Відображення фільтрованого зображення на сторінці
        const eCanvasPrewitt = document.getElementById('prewittECanvas');
        const eCtxPrewitt = eCanvasPrewitt.getContext('2d');

        eCtxPrewitt.putImageData(ePrewittImageData, 0, 0);

        const canvasOriginal = document.createElement("canvas");
        const ctxOriginal = canvasOriginal.getContext('2d');
        canvasOriginal.width = image.width;
        canvasOriginal.height = image.height;
        ctxOriginal.drawImage(equalizedImage, 0, 0, equalizedImage.width, equalizedImage.height);

        const imageDataOriginal = ctxOriginal.getImageData(0, 0, equalizedImage.width, equalizedImage.height);

        // Застосовуємо оператор Собела
        const sobelImageData = applySobelOperator(imageDataOriginal);

        // Відображення фільтрованого зображення на сторінці
        const canvasSobel = document.getElementById('sobelECanvas');
        const ctxSobel = canvasSobel.getContext('2d');

        ctxSobel.putImageData(sobelImageData, 0, 0);
    };
}

function activeImage() {
    function setNewColor(activeIndex) {
        imageList.forEach((item, index) => {
            if (index === activeIndex) {
                imageList[activeIndex].style.borderColor = 'rgb(115, 191, 38)';
            } else {
                item.style.borderColor = 'rgb(199, 195, 195)';
            }
        });
    }

    if (image.src === validateImagePath('./sample.bmp')) {
        setNewColor(0);
    }
    if (image.src === validateImagePath('./sample2.jpg')) {
        setNewColor(1);
    }
    if (image.src === validateImagePath('./sample3.jpg')) {
        setNewColor(2);
    }
}

function validateImagePath(imagePath) {
    return `${location.origin + imagePath.split('').slice(1).join('')}`;
}

function setImage(imagePath, eqPath) {
    if (image.src === validateImagePath(imagePath)) {
        return;
    } else {
        chartRGB.destroy();
        chartRed.destroy();
        chartGreen.destroy();
        chartBlue.destroy();
        chartERGB.destroy();
        chartERed.destroy();
        chartEGreen.destroy();
        chartEBlue.destroy();

        image.src = imagePath;
        equalizedImage.src = eqPath;
        activeImage();
    }
}

// Функція для отримання гістограми каналу кольору зображення
function getChannelHistogram(imageData, channel) {
    const histogram = Array(256).fill(0);

    for (let i = 0; i < imageData.length; i += 4) {
        const value = imageData[i + channel]; // Вибір значення з потрібного каналу
        histogram[value]++;
    }

    return histogram;
}

// Функція для отримання гістограм R, G, B каналів зображення
function getImageHistograms(image) {
    // console.log(image);
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, image.width, image.height);

    const imageData = ctx.getImageData(0, 0, image.width, image.height).data;

    const redHistogram = getChannelHistogram(imageData, 0);   // Червоний канал
    const greenHistogram = getChannelHistogram(imageData, 1); // Зелений канал
    const blueHistogram = getChannelHistogram(imageData, 2);  // Синій канал

    return { redHistogram, greenHistogram, blueHistogram };
}

// Функція для еквалізації гістограми каналу кольору зображення
function equalizeChannel(imageData, channel) {
    const histogram = Array(256).fill(0);

    // Рахуємо гістограму для обраного каналу
    for (let i = 0; i < imageData.length; i += 4) {
        const value = imageData[i + channel];
        histogram[value]++;
    }

    // Обчислюємо кумулятивну гістограму
    let cumulative = 0;
    const cumulativeHistogram = histogram.map((count) => cumulative += count);

    // Еквалізуємо значення пікселів
    for (let i = 0; i < imageData.length; i += 4) {
        const value = imageData[i + channel];
        const equalizedValue = (cumulativeHistogram[value] / cumulative) * 255;
        imageData[i + channel] = equalizedValue;
    }
}

// Функція для еквалізації всіх каналів
function equalizeImage(imageData) {
    equalizeChannel(imageData, 0);  // Червоний канал
    equalizeChannel(imageData, 1);  // Зелений канал
    equalizeChannel(imageData, 2);  // Синій канал
}

function base64ToImage(base64String) {
    const parts = base64String.split(";base64,");
    const type = parts[0].split(":")[1];
    const data = parts[1];

    const binaryString = window.atob(data);
    const length = binaryString.length;
    const bytes = new Uint8Array(length);

    for (let i = 0; i < length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    const blob = new Blob([bytes], { type });

    const url = URL.createObjectURL(blob);

    return url;
}

function saveImage(url, filename) {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

const maskX = [[0, -1], [1, 0]];
const maskY = [[-1, 0], [0, 1]];

// Функція для застосування оператора Робертса до зображення
function applyRobertsOperator(imageData) {
    const width = imageData.width;
    const height = imageData.height;
    const newData = new Uint8ClampedArray(imageData.data.length);

    for (let y = 0; y < height - 1; y++) {
        for (let x = 0; x < width - 1; x++) {
            const pixelIndex = (y * width + x) * 4;

            // Застосовуємо маску для горизонтальної зміни
            const gx = imageData.data[pixelIndex + 4] * maskX[0][1] + imageData.data[pixelIndex + width * 4] * maskY[1][0];

            // Застосовуємо маску для вертикальної зміни
            const gy = imageData.data[pixelIndex + width * 4] * maskY[0][1] + imageData.data[pixelIndex] * maskX[1][0];

            // Обчислюємо інтенсивність зміни за допомогою формули
            const intensity = Math.sqrt(gx * gx + gy * gy);

            // Записуємо нове значення пікселя
            newData[pixelIndex] = intensity;
            newData[pixelIndex + 1] = intensity;
            newData[pixelIndex + 2] = intensity;
            newData[pixelIndex + 3] = 255; // Альфа-канал
        }
    }

    // Створюємо новий ImageData об'єкт для еквалізованого зображення
    const newImageData = new ImageData(newData, width, height);

    return newImageData;
}

const prewittMaskX = [[1, 0, -1], [1, 0, -1], [1, 0, -1]];
const prewittMaskY = [[-1, -1, -1], [0, 0, 0], [1, 1, 1]];

// Функція для застосування оператора Превіта до зображення
function applyPrewittOperator(imageData) {
    const width = imageData.width;
    const height = imageData.height;
    const newData = new Uint8ClampedArray(imageData.data.length);

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            const pixelIndex = (y * width + x) * 4;

            // Застосовуємо маску Превіта для горизонтальної та вертикальної зміни
            let gx = 0;
            let gy = 0;

            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const neighborPixelIndex = ((y + i) * width + (x + j)) * 4;
                    gx += imageData.data[neighborPixelIndex] * prewittMaskX[i + 1][j + 1];
                    gy += imageData.data[neighborPixelIndex] * prewittMaskY[i + 1][j + 1];
                }
            }

            // Обчислюємо інтенсивність зміни за допомогою формули
            const intensity = Math.sqrt(gx * gx + gy * gy);

            // Записуємо нове значення пікселя
            newData[pixelIndex] = intensity;
            newData[pixelIndex + 1] = intensity;
            newData[pixelIndex + 2] = intensity;
            newData[pixelIndex + 3] = 255; // Альфа-канал
        }
    }

    // Створюємо новий ImageData об'єкт для фільтрованого зображення
    const newImageData = new ImageData(newData, width, height);

    return newImageData;
}


// Функція для застосування оператора Собела до зображення
function applySobelOperator(imageData) {
    const maskX = [[1, 0, -1], [2, 0, -2], [1, 0, -1]];
    const maskY = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];
    const width = imageData.width;
    const height = imageData.height;
    const newData = new Uint8ClampedArray(imageData.data.length);

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            const pixelIndex = (y * width + x) * 4;

            // Застосовуємо маску Собела для горизонтальної та вертикальної зміни
            let gx = 0;
            let gy = 0;

            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const neighborPixelIndex = ((y + i) * width + (x + j)) * 4;
                    gx += imageData.data[neighborPixelIndex] * maskX[i + 1][j + 1];
                    gy += imageData.data[neighborPixelIndex] * maskY[i + 1][j + 1];
                }
            }

            // Обчислюємо інтенсивність зміни за допомогою формули
            const intensity = Math.sqrt(gx * gx + gy * gy);

            // Записуємо нове значення пікселя
            newData[pixelIndex] = intensity;
            newData[pixelIndex + 1] = intensity;
            newData[pixelIndex + 2] = intensity;
            newData[pixelIndex + 3] = 255; // Альфа-канал
        }
    }

    // Створюємо новий ImageData об'єкт для фільтрованого зображення
    const newImageData = new ImageData(newData, width, height);

    return newImageData;
}