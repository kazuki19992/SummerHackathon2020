$(function(){
    // ページ内を加工(キーワード→絵文字)
    // htmlのbody内を形態素解析を行い、日本語の単語ごとに区切る
    let segmenter = new TinySegmenter();
    let bodyElement = $("body").html();
    let segs = segmenter.segment(bodyElement);
    // $.getJSON("https://raw.githubusercontent.com/yagays/emoji-ja/master/data/keyword2emoji_ja.json", (json) => {
    //     // jsonを受信したあとで実行する処理をここに書くっぽい！
    //     // jsonを連想配列にパースする！
    //     json = JSON.parse(json);
    // });

    // console.log(json);
    // console.log(segs.join(" | "));

    (function (handleload) {
        var xhr = new XMLHttpRequest;

        xhr.addEventListener('load', handleload, false);
        xhr.open('GET', 'https://raw.githubusercontent.com/yagays/emoji-ja/master/data/keyword2emoji_ja.json', true);
        xhr.send(null);
    }(function handleLoad (event) {
        var xhr = event.target,
            obj = JSON.parse(xhr.responseText);

        console.log(obj);
    }));
    /*
      // segsの要素数を取得
      let segsLength = segs.length;

      for(let i = 0; i < segsLength; i++){
          if(ja2Bit(segs[i])){
              // 検索の対象だった場合はjsonファイルを検索する
              console.log(segs[i]);

          }
      }
  */
    // ページ内を加工(草→w)
    $("body").html(
        $("body").html().replace( /草/g, "w" )
    );
});

function ja2Bit ( str ) {
    // 日本語だけで構成されているか否か判断する
    // 日本語だけで構成されている: true, アルファベットや記号などが含まれている: false
    return ( str.match(/^[\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf]+$/) )? true : false
}