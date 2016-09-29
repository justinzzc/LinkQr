function utf16to8(str) {  
    var out, i, len, c;  
    out = "";  
    len = str.length;  
    for(i = 0; i < len; i++) {  
    c = str.charCodeAt(i);  
    if ((c >= 0x0001) && (c <= 0x007F)) {  
        out += str.charAt(i);  
    } else if (c > 0x07FF) {  
        out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));  
        out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));  
        out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));  
    } else {  
        out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));  
        out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));  
    }  
    }  
    return out;  
} 

function createQR(content){

	var content =utf16to8(content);
    $('#qr').children().remove();
	$('#qr').qrcode({width:200,height:200,correctLevel:0,text:content});
}

function refresh(){
	chrome.tabs.getSelected(null, function(tab) { 
		var myTabUrl = tab.url;
	 	createQR(myTabUrl);
	});
}

function base64Img2Blob(code){
    var parts = code.split(';base64,');
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;

    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], {type: contentType}); 
}
function downloadFile(fileName, content){
   
    var aLink = document.createElement('a');
    var blob = base64Img2Blob(content); //new Blob([content]);
    aLink.download = fileName;
    aLink.href = URL.createObjectURL(blob);
    aLink.click();
}    

var words ={
    'zh-cn':{
        download:'下  载'
    },
    'en':{
        download:'download'
    }
};

var currentLang = (navigator.language||navigator.browserLanguage||'zh-cn').toLowerCase();         

var currentWords = words[currentLang]||words['en'];

$(function (){
	refresh();
    $('#download').html(currentWords.download);
    $('#download').click(function(){
        var canvas = $('#qr canvas')[0];
        downloadFile('linkQr.png', canvas.toDataURL("image/png"));
    });
    
})