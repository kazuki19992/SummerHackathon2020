$(function(){
    // ページ内を加工(キーワード→絵文字)
    // htmlのbody内を形態素解析を行い、日本語の単語ごとに区切る
    let segmenter = new TinySegmenter();
    let bodyElement = $("body").html();
    let segs = segmenter.segment(bodyElement);

    // 20のキャッシュ空間を作成する
    // [モード][エントリ]
    // モード 0:キー, 1:絵文字
    let cache = new Array(2);
    for(let i = 0; i < 2; i++){
        cache[i] = new Array(20).fill(null);
    }

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

        // キャッシュ用カウント変数
        let cacheCount = 0;

        for(let i = 0; i < segsLength; i++){
            if(ja2Bit(segs[i])){
                // 検索の対象だった場合はjsonファイルを検索する

                // 現在の単語を格納
                let phrase = segs[i];

                // ひらがな一文字ならスキップするような処理
                // 平仮名か片仮名だけの一文字構成か
                if(!phraseSkip(phrase)){
                    // 絵文字が存在するかどうか調べる

                    // キャッシュ存在判定フラグ
                    let cacheExist = false;

                    // キャッシュ内を探索する
                    for(let j = 0; j < 20; j++){
                        if(phrase == cache[0][j]){
                            cacheExist = true;
                            // キャッシュでヒットした場合はそれから出力する
                            segs[i] = phrase + cache[1][j];

                            let tmpKey = cache[0][j];
                            let tmpEmoji = cache[1][j];
                            // LRU方式で、参照したデータを配列の先頭に持ってくるため、データを詰める
                            for(let k = j; k > 0; k--){
                                cache[0][k] = cache[0][k - 1];
                                cache[1][k] = cache[1][k - 1];
                            }
                            cache[0][0] = tmpKey;
                            cache[1][0] = tmpEmoji;
                            consoleCashe(cache, 1, segs[i]);
                        }
                    }
                    let emojiArray;

                    if(!cacheExist && (emojiArray = obj[phrase])){
                    // if(!cacheExist){
                        // segs[i]で絵文字を配列で取得
                        // let emojiArray = obj[segs[i]];
                        console.log(emojiArray);
                        // 取得した絵文字の数
                        let emojiCount = emojiArray.length;

                        // 取得した絵文字の数
                        if(emojiCount > 2){
                            // 絵文字が3個以上の場合はランダムで絵文字が2個選ばれる
                            let focusEmoji1 = Math.floor(Math.random()*((emojiCount - 1) - 0) + 0);
                            let focusEmoji2 = Math.floor(Math.random()*((emojiCount - 1) - 0) + 0);
                            segs[i] = phrase + emojiArray[focusEmoji1] + emojiArray[focusEmoji2];

                            // キャッシュ更新
                            cache = cacheLRU(cache, phrase, emojiArray[focusEmoji1] + emojiArray[focusEmoji2]);
                        }else if(emojiCount == 2){
                            // 絵文字の数が2個の場合は2つ表示させる
                            segs[i] = phrase + emojiArray[0] + emojiArray[1];
                            // キャッシュ更新
                            cache = cacheLRU(cache, phrase, emojiArray[0] + emojiArray[1]);
                        }else{
                            // 絵文字が1個の場合は1個表示させる
                            segs[i] = phrase + emojiArray[0];
                            // キャッシュ更新
                            cache = cacheLRU(cache, phrase, emojiArray[0]);
                        }
                        consoleCashe(cache, 0, segs[i]);
                    }
                }else{
                    segs[i] = phrase + "(接続詞?)";
                }

                // console.log(segs[i]);


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

function consoleCashe(cache, mode, text){
    if(mode == 0){
        console.log("---キャッシュ更新(" + text + ")---");
    }else{
        console.log("---!!!HIT!!!(" + text + ")---")
    }
    for(let i = 0; i < 20; i++){
        console.log("cache " + i + ": " + cache[0][i] + "->" + cache[1][i]);
    }
}

function cacheLRU(cache, text, emoji){
    for(let i = 19; i > 0; i--){
        cache[0][i] = cache[0][i-1];
        cache[1][i] = cache[1][i-1];
    }
    cache[0][0] = text;
    cache[1][0] = emoji;

    return cache;
}

// ひらがな一文字でスキップする処理
function phraseSkip(phrase){
    // ひらがな一文字or読点(、)句読点(。)の場合はtrue
    // return ( phrase.match(/{[\u3041-\u3094]|[\u30a1-\u30fa]|[\uff65-\uff9f]|、}/))? true : false
    // if(phrase.match(/{^[ぁ-んー　]*$/)){
    //     return true;
    // }else{
    //     return false;
    // }

    // なぜか正規表現で動かなかったので愚直にかきました(言い訳)
    switch(phrase){
        case "あ":case "い":case "う":case "え":case "お":
        case "か":case "き":case "く":case "け":case "こ":
        case "さ":case "し":case "す":case "せ":case "そ":
        case "た":case "ち":case "つ":case "て":case "と":
        case "な":case "に":case "ぬ":case "ね":case "の":
        case "は":case "ひ":case "ふ":case "へ":case "ほ":
        case "ま":case "み":case "む":case "め":case "も":
        case "や":case "ゆ":case "よ":
        case "ら":case "り":case "る":case "れ":case "ろ":
        case "わ":case "を":case "ん":
        case "が":case "ぎ":case "ぐ":case "げ":case "ご":
        case "ざ":case "じ":case "ず":case "ぜ":case "ぞ":
        case "だ":case "ぢ":case "づ":case "で":case "ど":
        case "ば":case "び":case "ぶ":case "べ":case "ぼ":
        case "ぱ":case "ぴ":case "ぷ":case "ぺ":case "ぽ":
            return true;
        default:
            return false;
    }
}

function ja2Bit ( str ) {
    // 日本語だけで構成されているか否か判断する
    // 日本語だけで構成されている: true, アルファベットや記号などが含まれている: false
    return ( str.match(/^[\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf]+$/) )? true : false
}