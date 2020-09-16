$(function(){
    // ページ内を加工(キーワード→絵文字)
    // htmlのbody内を形態素解析を行い、日本語の単語ごとに区切る
    let segmenter = new TinySegmenter();
    let bodyElement = $("body").html();
    let segs = segmenter.segment(bodyElement);
    var json;

    // jsonを取得
    (function (handleload) {
        var xhr = new XMLHttpRequest;

        xhr.addEventListener('load', handleload, false);
        xhr.open('GET', 'https://raw.githubusercontent.com/kazuki19992/emoji-ja/master/data/keyword2emoji_ja.json', true);
        xhr.send(null);
    }(function handleLoad (event) {
        var xhr = event.target, obj = JSON.parse(xhr.responseText);
        console.log(obj);

        // jsonのキーを検索する
        // segsの要素数を取得
        let segsLength = segs.length;

        for(let i = 0; i < segsLength; i++){
            if(ja2Bit(segs[i])){
                // 検索の対象だった場合はjsonファイルを検索する

                // 現在の単語を格納
                let phrase = segs[i];

                // 絵文字が存在するかどうか調べる
                if(obj[phrase]){
                    // segs[i]で絵文字を配列で取得
                    let emojiArray = obj[segs[i]];
                    // 取得した絵文字の数
                    let emojiCount = emojiArray.length;
                    // 絵文字の選択
                    let focusEmoji = Math.floor(Math.random()*((emojiCount - 1) - 0) + 0);
                    // segs[i]を単語と絵文字に置き換える
                    segs[i] = phrase + emojiArray[focusEmoji];
                }

                console.log(segs[i]);


            }
        }

    }));
    // console.log(json);

    // ページ内を置換
    replacementText("大草原", "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwww");
    replacementText("草", "w");
    replacementText("！", "❗️❗️");
    replacementText("。", "❗️");
    replacementText("？", "❓❓");
});

// 置換処理を行う
function replacementText(patternMatch, replaceText){
    pattern = new RegExp(patternMatch, "g");
    $("body").html(
		$("body").html().replace( pattern, replaceText )
	);
}

function ja2Bit ( str ) {
    // 日本語だけで構成されているか否か判断する
    // 日本語だけで構成されている: true, アルファベットや記号などが含まれている: false
    return ( str.match(/^[\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf]+$/) )? true : false
}