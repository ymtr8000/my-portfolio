document.addEventListener('DOMContentLoaded', () => {
		// --- ハンバーガーメニューの制御 ---
		const menuBtn = document.getElementById('menu-btn');
		const fullMenu = document.getElementById('full-menu');
		const closeBtn = document.getElementById('close-btn');
		
		if (menuBtn && fullMenu) {
			menuBtn.addEventListener('click', () => fullMenu.classList.add('active'));
		}
		if (closeBtn && fullMenu) {
			closeBtn.addEventListener('click', () => fullMenu.classList.remove('active'));
		}
		
		// --- スクロールでメニューボタンを隠す制御 ---
		let lastScrollY = window.scrollY;
		window.addEventListener('scroll', () => {
				if (!menuBtn) return;
				if (window.scrollY > lastScrollY && window.scrollY > 100) {
					menuBtn.classList.add('menu-hidden');
				} else {
					menuBtn.classList.remove('menu-hidden');
				}
				lastScrollY = window.scrollY;
		});
		
		// --- ★写真拡大（ライトボックス）左右切り替え＆スワイプ機能 ---
		const galleryImages = Array.from(document.querySelectorAll('.gallery-item img'));
		const lightbox = document.getElementById('lightbox');
		const lightboxImg = document.getElementById('lightbox-img');
		const lightboxClose = document.querySelector('#lightbox .close-btn');
		const prevBtn = document.getElementById('lightbox-prev');
		const nextBtn = document.getElementById('lightbox-next');
		
		let currentIndex = 0;
		let touchStartX = 0;
		let touchEndX = 0;
		
		// 拡大画面を表示する関数
		function showImage(index) {
			if (index < 0 || index >= galleryImages.length) return;
			currentIndex = index;
			lightboxImg.src = galleryImages[currentIndex].src;
		}
		
		// 前の画像へ
		function prevImage() {
			let index = currentIndex - 1;
			if (index < 0) index = galleryImages.length - 1; // 最初の画像なら最後にループ
			showImage(index);
		}
		
		// 次の画像へ
		function nextImage() {
			let index = currentIndex + 1;
			if (index >= galleryImages.length) index = 0; // 最後の画像なら最初にループ
			showImage(index);
		}
		
		// 各画像をクリックした時の処理
		galleryImages.forEach((img, index) => {
				img.addEventListener('click', () => {
						lightbox.style.display = 'flex';
						showImage(index);
				});
		});
		
		// 左右ボタンのクリックイベント
		if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prevImage(); });
		if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); nextImage(); });
		if (lightboxClose) lightboxClose.addEventListener('click', () => lightbox.style.display = 'none');
		
		// 背景クリックで閉じる
		if (lightbox) {
			lightbox.addEventListener('click', (e) => {
					if (e.target === lightbox || e.target === lightboxImg) {
						lightbox.style.display = 'none';
					}
			});
		}
		
		// ★スマホ用：横スワイプの検知
		if (lightbox) {
			lightbox.addEventListener('touchstart', (e) => {
					touchStartX = e.changedTouches[0].screenX;
			}, { passive: true });
			
			lightbox.addEventListener('touchend', (e) => {
					touchEndX = e.changedTouches[0].screenX;
					handleSwipe();
			}, { passive: true });
		}
		
		function handleSwipe() {
			const swipeDistance = touchEndX - touchStartX;
			if (swipeDistance > 50) {
				prevImage(); // 右スワイプで前の画像
			} else if (swipeDistance < -50) {
				nextImage(); // 左スワイプで次の画像
			}
		}
		
		// キーボードの左右矢印キーにも一応対応
		document.addEventListener('keydown', (e) => {
				if (lightbox && lightbox.style.display === 'flex') {
					if (e.key === 'ArrowLeft') prevImage();
					if (e.key === 'ArrowRight') nextImage();
					if (e.key === 'Escape') lightbox.style.display = 'none';
				}
		});
});
