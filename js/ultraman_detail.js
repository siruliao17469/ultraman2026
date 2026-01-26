// js/ultraman_detail.js

document.addEventListener('DOMContentLoaded', function() {
    // --- 奥特曼数据中心 ---
    // 数据与 category.js 同步
    const ultramanData = {
        'm78_l77': [
            { name: 'ゾフィー', image: 'image/M78/ZOFFY.webp', description: '宇宙警備隊 隊長', detailPage: 'ultraman_detail.html?name=zoffy' },
            { name: 'ウルトラマン', image: 'image/M78/MAN.webp', description: 'すべての伝説は、ここから始まった', detailPage: 'ultraman_detail.html?name=man' },
            { name: 'ウルトラセブン', image: 'image/M78/SEVEN.webp', description: '恒星観測員', detailPage: 'ultraman_detail.html?name=seven' },
            { name: 'ウルトラマン　ジャック', image: 'image/M78/JACK.webp', description: 'ウルトラブレスレットを持つ戦士', detailPage: 'ultraman_detail.html?name=jack' },
            { name: 'ウルトラマン　エース', image: 'image/M78/ACE.webp', description: '光線技を得意とするウルトラマン', detailPage: 'ultraman_detail.html?name=ace' },
            { name: 'ウルトラマン　タロウ', image: 'image/M78/TAROU.webp', description: 'ウルトラハートを持つウルトラマン', detailPage: 'ultraman_detail.html?name=tarou' },
            { name: 'ウルトラの父　ケン', image: 'image/M78/FATHER.webp', description: '宇宙警備隊 大隊長', detailPage: 'ultraman_detail.html?name=father' },
            { name: 'ウルトラの母　マリー', image: 'image/M78/MOTHER.webp', description: '銀河十字軍 隊長', detailPage: 'ultraman_detail.html?name=mother' },
            { name: 'ウルトラマン　レオ', image: 'image/L77/LEO.webp', description: 'L77星雲出身の王子、格闘技を得意とする戦士', detailPage: 'ultraman_detail.html?name=leo' },
            { name: 'アストラ', image: 'image/L77/ASTRA.webp', description: 'レオの弟、格闘技を得意とする戦士', detailPage: 'ultraman_detail.html?name=astra' },
            { name: 'ウルトラマン　エイティ', image: 'image/M78/80.webp', description: 'ウルトラ先生、マイナスエネルギーと向き合うウルトラマン', detailPage: 'ultraman_detail.html?name=80' },
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

    // --- 页面逻辑 ---
    const container = document.getElementById('ultraman-detail-container');
    const urlParams = new URLSearchParams(window.location.search);
    const ultramanName = urlParams.get('name');

    if (ultramanName) {
        fetch(`data/details/${ultramanName}.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // -- 动态生成HTML --
                // 基本信息
                let detailHtml = `
                    <div class="ultraman-image">
                        <img src="${data.mainImage}" alt="${data.name}">
                    </div>
                    <div class="ultraman-details">
                        <h2>${data.name}</h2>
                `;

                // 描述 (兼容字符串和数组)
                if (data.description) {
                    if (Array.isArray(data.description)) {
                        data.description.forEach(p => {
                            detailHtml += `<p>${p}</p>`;
                        });
                    } else if (typeof data.description === 'string') {
                        detailHtml += `<p>${data.description}</p>`;
                    }
                }

                // 能力 (兼容对象数组和字符串数组)
                if (data.abilities && data.abilities.length > 0) {
                    detailHtml += `<h3>${data.abilitiesTitle || 'Abilities'}</h3>`;
                    if (typeof data.abilities[0] === 'object' && data.abilities[0] !== null) {
                        detailHtml += '<ul>';
                        data.abilities.forEach(ability => {
                            detailHtml += `<li><strong>${ability.name}:</strong> ${ability.description || ''}</li>`;
                        });
                        detailHtml += '</ul>';
                    } else {
                        detailHtml += `<p>${data.abilities.join('、')}</p>`;
                    }
                }

                // 武器 (兼容对象数组和字符串数组)
                if (data.weapons && data.weapons.length > 0) {
                    detailHtml += `<h4 class="weapon-title">${data.weaponsTitle || 'Weapons'}</h4>`;
                    if (typeof data.weapons[0] === 'object' && data.weapons[0] !== null) {
                        detailHtml += '<ul>';
                        data.weapons.forEach(weapon => {
                            detailHtml += `<li><strong>${weapon.name}:</strong> ${weapon.description || ''}</li>`;
                        });
                        detailHtml += '</ul>';
                    } else {
                        detailHtml += `<p>${data.weapons.join('、')}</p>`;
                    }
                }

                detailHtml += `<a href="javascript:history.back()" class="back-to-category">戻る</a></div>`;

                // 图片库 (无标题)
                if (data.gallery && data.gallery.length > 0) {
                    detailHtml += `
                        <div class="ultraman-gallery">
                            <div class="gallery-images">
                    `;
                    data.gallery.forEach(imgSrc => {
                        detailHtml += `<img src="${imgSrc}" alt="${data.name} Image">`;
                    });
                    detailHtml += `</div></div>`;
                }

                container.innerHTML = detailHtml;
            })
            .catch(error => {
                console.error('Error fetching ultraman data:', error);
                showDataNotAvailable();
            });
    } else {
        showError();
    }

    function showDataNotAvailable() {
        container.innerHTML = `
            <p class="error-message">
                このカテゴリーにはまだデータがありません。今後の更新をお楽しみに！<br>
                <a href="javascript:history.back()">戻る</a>
            </p>
        `;
        container.style.display = 'block';
    }

    function showError() {
        container.innerHTML = `
            <p class="error-message">
                指定されたウルトラマンが見つかりませんでした。<br>
                <a href="index.html">ホームページに戻る</a>
            </p>
        `;
        container.style.display = 'block';
    }
});