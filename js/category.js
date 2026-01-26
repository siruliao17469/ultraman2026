// js/category.js

document.addEventListener('DOMContentLoaded', function() {
    // --- 奥特曼数据中心 ---
    // 您可以在这里轻松地添加、修改或删除奥特曼信息。
    // name: 奥特曼的名字
    // image: 图片的路径
    // description: 一段简短的描述
    // detailPage: 点击后跳转的详情页链接（暂时都指向一个通用页面）
    const ultramanData = {
        'm78_l77': [
            { name: 'ゾフィー', image: 'image/M78/ZOFFY.webp', description: '宇宙警備隊 隊長', detailPage: 'ultraman_detail.html?name=zoffy' },
            { name: 'ウルトラマン', image: 'image/M78/MAN.webp', description: 'すべての伝説は、ここから始まった', detailPage: 'ultraman_detail.html?name=man' },
            { name: 'ウルトラセブン', image: 'image/M78/SEVEN.webp', description: '恒星観測員', detailPage: 'ultraman_detail.html?name=seven' },
            { name: 'ウルトラマン　ジャック', image: 'image/M78/JACK.webp', description: 'ウルトラブレスレットを持つ戦士', detailPage: 'ultraman_detail.html?name=jack' },
            { name: 'ウルトラマン　エース', image: 'image/M78/ACE.webp', description: '光線技を得意とするウルトラマン', detailPage: 'ultraman_detail.html?name=ace' },
            { name: 'ウルトラマン　タロウ', image: 'image/M78/TAROU.webp', description: 'ウルトラハートを持つウルトラマン', detailPage: 'ultraman_detail.html?name=taro' },
            { name: 'ウルトラの父　ケン', image: 'image/M78/FATHER.webp', description: '宇宙警備隊 大隊長', detailPage: 'ultraman_detail.html?name=ken' },
            { name: 'ウルトラの母　マリー', image: 'image/M78/MOTHER.webp', description: '銀河十字軍 隊長', detailPage: 'ultraman_detail.html?name=marie' },
            { name: 'ウルトラマン　レオ', image: 'image/L77/LEO.webp', description: 'L77星雲出身の王子、格闘技を得意とする戦士', detailPage: 'ultraman_detail.html?name=leo' },
            { name: 'アストラ', image: 'image/L77/ASTRA.webp', description: 'レオの弟、格闘技を得意とする戦士', detailPage: 'ultraman_detail.html?name=astra' },
            { name: 'ウルトラマン　エイティ', image: 'image/M78/EIGHTY.webp', description: 'ウルトラ先生、マイナスエネルギーと向き合うウルトラマン', detailPage: 'ultraman_detail.html?name=eighty' },
            { name: 'ユリアン', image: 'image/M78/YULLIAN.webp', description: '光の国のプリンセス', detailPage: 'ultraman_detail.html?name=yullian' },
            { name: 'ウルトラマン　メビウス', image: 'image/M78/MEBIUS.webp', description: '宇宙警備隊の新人、無限の可能性を秘めたウルトラマン', detailPage: 'ultraman_detail.html?name=mebius' },
            { name: 'ウルトラマン　ヒカリ', image: 'image/M78/HIKARI.webp', description: '光の国の科学者', detailPage: 'ultraman_detail.html?name=hikari' },
            { name: 'ウルトラマン　グレート', image: 'image/M78/GREAT.webp', description: 'ゴーデス細胞の専門家', detailPage: 'ultraman_detail.html?name=great' },
            { name: 'ウルトラマン　パワード', image: 'image/M78/POWERED.webp', description: '自由のウルトラ戦士', detailPage: 'ultraman_detail.html?name=powered' },
            { name: 'ウルトラマン　ネオス', image: 'image/M78/NEOS.webp', description: 'ダークマター対処のために選ばれた若きウルトラ戦士', detailPage: 'ultraman_detail.html?name=neos' },
            { name: 'ウルトラ　セブンツーワン', image: 'image/M78/SEVEN21.webp', description: 'ネオスのパートナー、ウルトラマンのエリート', detailPage: 'ultraman_detail.html?name=seven21' },
            { name: 'ウルトラマン　マックス', image: 'image/M78/MAX.webp', description: '「最速・最強」と称されるウルトラマン', detailPage: 'ultraman_detail.html?name=max' },
            { name: 'ウルトラマン　ゼノン', image: 'image/M78/ZENON.webp', description: 'マックスをサポートする強力な戦士', detailPage: 'ultraman_detail.html?name=zenon' },
            { name: 'ウルトラマン　ゼロ', image: 'image/M78/ZERO.webp', description: 'セブンの息子、若くして強大な戦士', detailPage: 'ultraman_detail.html?name=zero' },
            { name: 'ウルトラマン　タイガ', image: 'image/M78/TAIGA.webp', description: 'タロウの息子、光の勇者、フーマ、タイタスと三人小隊を組んでいる', detailPage: 'ultraman_detail.html?name=taiga' },            
            { name: 'ウルトラマン　レグロス', image: 'image/L77/REGLOS.webp', description: '宇宙幻獣拳法を極めたウルトラマン', detailPage: 'ultraman_detail.html?name=reglos' },
            { name: 'ウルトラマン　リブット', image: 'image/M78/RIBUT.webp', description: '銀河救援隊の一員', detailPage: 'ultraman_detail.html?name=ribut' },
            { name: 'ウルトラマン　スコット', image: 'image/M78/SCOTT.webp', description: 'ウルトラ小隊「Ultra Force」の隊長', detailPage: 'ultraman_detail.html?name=scott' },
            { name: 'ウルトラマン　チャック', image: 'image/M78/CHUCK.webp', description: 'ウルトラ小隊のメンバーの一人', detailPage: 'ultraman_detail.html?name=chuck' },
            { name: 'ウルトラウーマン　ベス', image: 'image/M78/BES.webp', description: 'ウルトラ小隊のメンバーの一人', detailPage: 'ultraman_detail.html?name=beth' },
            { name: 'ウルトラマンキング', image: 'image/M78/KING.webp', description: '伝説のウルトラマン', detailPage: 'ultraman_detail.html?name=king' },
        ],
        
        'earth': [
            { name: 'ウルトラマン　ガイア', image: 'image/EARTH/GAIA.webp', description: '大地の光', detailPage: 'ultraman_detail.html?name=gaia' },
            { name: 'ウルトラマン　アグル', image: 'image/EARTH/AGUL.webp', description: '海の光', detailPage: 'ultraman_detail.html?name=agul' },
            { name: 'ウルトラマン　ジード', image: 'image/EARTH/GEED.webp', description: 'ベリアルの息子、運命に立ち向かうウルトラマン', detailPage: 'ultraman_detail.html?name=geed' },
        ],

        'o50': [
            { name: 'ウルトラマン　オーブ', image: 'image/O50/ORB.webp', description: 'O-50で光を授かり誕生したウルトラマン', detailPage: 'ultraman_detail.html?name=orb' },
            { name: 'ウルトラマン　ロッソ', image: 'image/O50/ROSSO.webp', description: 'ブルの兄、俺色に染め上げろ！ルーブ！', detailPage: 'ultraman_detail.html?name=rosso' },
            { name: 'ウルトラマン　ブル', image: 'image/O50/BUL.webp', description: 'ロッソの弟、俺色に染め上げろ！ルーブ！', detailPage: 'ultraman_detail.html?name=blu' },
            { name: 'ウルトラウーマン　グリージョ', image: 'image/O50/GRIGIO.webp', description: 'ローブの妹、みんなを応援すウルトラウーマン', detailPage: 'ultraman_detail.html?name=grigio' },
            { name: 'ウルトラマン　フーマ', image: 'image/O50/FUMA.webp', description: '風の覇者、三人小隊のメンバーの一人', detailPage: 'ultraman_detail.html?name=fuma' },
        ],
        'u40': [
            { name: 'ウルトラマン　ジョーニアス', image: 'image/U40/JONEUS.webp', description: 'U40最強の戦士。', detailPage: 'ultraman_detail.html?name=joneus' },
            { name: 'ウルトラマン　タイタス', image: 'image/U40/TITAS.webp', description: '力の賢者、三人小隊のメンバーの一人。', detailPage: 'ultraman_detail.html?name=titas' },
        ],

        'z95': [
            { name: 'ウルトラマン　ゼアス', image: 'image/Z95/ZEARTH.webp', description: '勇気があり、きれい好きなウルトラマン。', detailPage: 'ultraman_detail.html?name=zearth' },
        ],

        'n project': [

        ],

        'other': [

        ],
    };

    // 分类标题
     const categoryTitles = {
        'm78_l77': 'M78星雲、L77星',
        'o50': 'O-50',
        'earth': '地球',
        'u40': 'U-40',
        'z95': 'Z-95',
        'n_project': 'N Project',
        'other': 'その他'
    };

    // --- 动态内容生成逻辑 ---
     const urlParams = new URLSearchParams(window.location.search);
    const series = urlParams.get('series');
    const ultramanListContainer = document.getElementById('ultraman-list');
    const categoryTitleElement = document.getElementById('category-title');

    if (series) {
        categoryTitleElement.textContent = categoryTitles[series] || 'ウルトラマン';

        if (series === 'n_project') {
            // 移除网格布局类，因为它会与我们的单体内容布局冲突
            ultramanListContainer.classList.remove('ultraman-grid');
            // 为父容器添加一个特定类，以便CSS可以控制其宽度
            ultramanListContainer.classList.add('n-project-container');

            // 动态加载 N Project 的专属 CSS 文件
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'css/n_project.css';
            document.head.appendChild(link);

            fetch('data/details/n_project.json')
                .then(response => response.json())
                .then(data => {
                    let innerHtml = `<h2>${data.title}</h2>`;
                    data.paragraphs.forEach(p => { innerHtml += `<p>${p}</p>`; });
                    data.sections.forEach(section => {
                        // 注意：您的代码使用了 section.title 和 section.items
                        // 请确保 n_project.json 文件中的键名与此匹配
                        innerHtml += `<h3>${section.title}</h3><ul>`;
                        section.items.forEach(item => { innerHtml += `<li>${item}</li>`; });
                        innerHtml += `</ul>`;
                    });
                    
                    innerHtml += `<div class="n-project-images">`;
                    data.gallery.forEach(imageUrl => {
                        innerHtml += `<img src="${imageUrl}">`;
                    });
                    innerHtml += `</div>`;

                    // 使用 .n-project-content 类包裹所有内容，以应用容器样式
                    ultramanListContainer.innerHTML = `<div class="n-project-content">${innerHtml}</div>`;
                })
                .catch(error => {
                    console.error("加载 n_project.json 失败:", error);
                    ultramanListContainer.innerHTML = '<p>コンテンツの読み込みに失敗しました。</p>';
                });

        } else if (ultramanData[series] && ultramanData[series].length > 0) {
            ultramanData[series].forEach(ultra => {
                const card = document.createElement('a');
                card.href = ultra.detailPage;
                card.className = 'ultraman-card';
                card.innerHTML = `
                    <img src="${ultra.image}" alt="${ultra.name}">
                    <div class="ultraman-info">
                        <h3>${ultra.name}</h3>
                        <p>${ultra.description}</p>
                    </div>
                `;
                ultramanListContainer.appendChild(card);
            });
        } else {
            ultramanListContainer.innerHTML = '<p>このカテゴリーにはまだデータがありません。今後の更新をお楽しみに！</p>';
        }
    } else {
        categoryTitleElement.textContent = 'カテゴリーを選択';
        ultramanListContainer.innerHTML = '<p>上のメニューからシリーズを選択してください。</p>';
    }
});