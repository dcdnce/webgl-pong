let upKeyPressed = false;
let downKeyPressed = false;

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
        upKeyPressed = true;
    } else if (event.key === 'ArrowDown') {
        downKeyPressed = true;
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowUp') {
        upKeyPressed = false;
    } else if (event.key === 'ArrowDown') {
        downKeyPressed = false;
    }
});

export { upKeyPressed, downKeyPressed };
