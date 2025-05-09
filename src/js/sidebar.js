(function(){
    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.getElementById('menu-btn');
    const menuBtn2 = document.getElementById('menu-btn2');

    menuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('-translate-x-full');
    });
    menuBtn2.addEventListener('click', () => {
        sidebar.classList.toggle('-translate-x-full');
    });
})()