'use strict';

/*
 * Дисклеймер:
 * Я понимаю здесь написанный код: асинхронные функции, промисы, fetch, json, arrow functions
 * Хотел таким образом сделать более функциональный слайдер c конфигом т.к. понравились идеи из урока :)
 */

let config;
let loopInterval;
let loopCount = 0;

async function init() {
    function attachMiniImages(images) {
        images.forEach((element, index) => {
            if (index !== 0) {
                $imageMinisHolder.innerHTML += (`<img src="${element}" onerror="imageError();">`);
            } else {
                $imageMinisHolder.innerHTML += (`<img src="${element}" onerror="imageError();" style="display: none;">`);
            }
        });
    }

    function loopImages(images) {
        changeBigImage(loopCount, images);
        changeSmallImagesOrder(loopCount, $imageMinisHolder.children);

        loopCount++;

        if (loopCount === images.length) {
            loopCount = 0;
        }
    }

    function changeBigImage(index) {
        $imageBig.src = images[index];
    }

    function changeSmallImagesOrder(index, elements) {
        for (let i = 0; i < elements.length; i++) {
            if (index > images.length - 1) {
                index = 0;
            }
            elements[i].src = images[index];
            index++;
        }
    }

    function changeImageByArrow(type) {
        clearInterval(loopInterval);
        
        if (type === 'add') {
            loopCount += 1;
        }

        if (type === 'dis') {
            loopCount -= 1;
        }

        if (loopCount > images.length - 1) {
            loopCount = 1;
        }

        if (loopCount <= 0) {
            loopCount = images.length - 1;
        }
        console.log(loopCount);

        changeBigImage(loopCount, images);
        changeSmallImagesOrder(loopCount, $imageMinisHolder.children);

        loopInterval = setInterval(loopImages, delay, images);
    }

    await fetch('js/config.json').then(response => {
            return response.json();
        })
        .then(data => config = data)
        .catch(e => console.error(e));

    const images = config.images;
    const delay = config.delay;
    const $imageBig = document.getElementById('image-big');
    const $imageMinisHolder = document.getElementById('image-minis');
    const $arrowLeft = document.getElementById('arrow-left');
    const $arrowRight = document.getElementById('arrow-right');

    attachMiniImages(images);

    for (let i = 0; i < images.length; i++) {
        $imageMinisHolder.children[i].addEventListener('click', () => {
            clearInterval(loopInterval);
            changeBigImage(i);
            changeSmallImagesOrder(i, $imageMinisHolder.children);
            loopInterval = setInterval(loopImages, delay, images);
        });
    }

    $arrowLeft.addEventListener('click', () => changeImageByArrow('dis'));
    $arrowRight.addEventListener('click', () => changeImageByArrow('add'));

    loopInterval = setInterval(loopImages, delay, images);
}

function imageError() {
    console.log(`Изображение не доступно`);
}

window.onload = init;