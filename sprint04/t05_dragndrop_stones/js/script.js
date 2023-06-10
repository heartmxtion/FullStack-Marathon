const blocks = document.querySelectorAll('.block');
let draggedBlock = null;

blocks.forEach(block => {
  block.addEventListener('mousedown', (event) => {
    if (block.classList.contains('draggable')) {
      draggedBlock = block;

      const offsetX = event.clientX - block.getBoundingClientRect().left;
      const offsetY = event.clientY - block.getBoundingClientRect().top;

      block.style.cursor = 'move';
      block.style.transformOrigin = 'center';

      block.style.left = event.clientX - offsetX + 'px';
      block.style.top = event.clientY - offsetY + 'px';

      block.classList.add('dragging');
    }
  });

  block.addEventListener('mouseup', () => {
    if (block.classList.contains('draggable')) {
      draggedBlock = null;

      block.style.cursor = 'pointer';
      block.style.transform = 'none';

      block.classList.remove('dragging');
    }
  });

  block.addEventListener('mousemove', (event) => {
    if (draggedBlock) {
      const x = event.clientX;
      const y = event.clientY;
      draggedBlock.style.left = x - draggedBlock.offsetWidth / 2 + 'px';
      draggedBlock.style.top = y - draggedBlock.offsetHeight / 2 + 'px';
    }
  });

  block.addEventListener('click', () => {
    if (block.classList.contains('draggable')) {
      block.classList.remove('draggable');
      block.style.border = '2px solid black';
      block.style.cursor = 'auto';
    } else {
      block.classList.add('draggable');
      block.style.border = 'none';
      block.style.cursor = 'pointer';
    }
  });
});
