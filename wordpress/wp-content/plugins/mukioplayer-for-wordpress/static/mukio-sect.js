//mukio-sect.js
//已知问题,修改winodw.location.hash会使IE标题变得奇怪,不影响使用
function addLoadHandler() {
  if(window.addEventListener) {
    window.addEventListener('load',function(event) { load();},false);
  }
  else if(window.attachEvent) {
    window.attachEvent('onload',function(event) { load();});
  }
  else {
    var previousOnload = window.onload;
    window.onload = function(event) {
      load();
      if (previousOnload) {
        previousOnload(event ? event : window.event);
      }
    }
  }
}
// addLoadHandler();
VideoList = [];

// function load() {
  // renderVideo();
// }
//渲染视频
function renderVideo() {
  // var list = parseList();
  var list = VideoList;
  if (list.length <=0)
    return;
  var index = getVideoIndex();
  // alert(index);
  // return;
  renderList(list,index);
  renderPlayer(list,index);
}
//给生成网页调用的
function addVideo(w,h,flashvars,ptitle,description) {
//  VideoList.push({'width':w,'height':h,'ptitle':ptitle,'flashvars':flashvars,'player':MukioPlayerURI,'desc':description});
  VideoList.push({'width':"100%",'height':"100%",'ptitle':ptitle,'flashvars':flashvars,'player':MukioPlayerURI,'desc':description});
}
//得到播放序号
function getVideoIndex() {
  var hash = window.location.hash;
  // alert(hash);
  if (hash.length <= 1) {
    return 0;
  }
  hash = hash.substr(1);
  var index = parseInt(hash) - 1;
  if (index < 0) {
    return 0;
  }
  // alert(index);
  if (index >= VideoList.length) {
    return VideoList.length - 1;
  }
  return index;
}
//生成播放列表
function renderList(list,index) {
  var pfield = document.getElementById('mkplayer-sectsel');
  if (list.length <= 0)
    return;
  if (list.length == 1) {
    if(!list[0]['ptitle'])
      return;
    else {
      pfield.innerHTML = list[0]['ptitle'];
      return;
    }
  }
  var select = document.createElement('select');
  var opt;
  for (var i = 0;i <list.length;i ++) {
    opt = document.createElement('option');
    opt.setAttribute('value',i);
    if (i == index)
      opt.setAttribute('selected','selected');
    opt.appendChild(document.createTextNode((i+1) + '. ' + list[i]['ptitle']));
    select.appendChild(opt);
  }
  select.onchange = function() {
    // alert(this.options[this.selectedIndex].value);
    var index = parseInt(this.options[this.selectedIndex].value);
    window.location.hash = '#' + (index + 1);
    renderPlayer(VideoList,index);
  };
  pfield.appendChild(select);
}
//嵌入播放器
function renderPlayer(list,index) {
  var flashvars_html = list[index]['flashvars'].replace('&amp;','&');
  var descfield = document.getElementById('mkplayer-desc');
  descfield.innerHTML = list[index]['desc']
  var videofield = document.getElementById('mkplayer-box');
  var playerstr = '<a style="height: 20px;width: 75px;margin-top:-22px;margin-left: 601px;position: absolute;display: block;" onclick="window.open(\'http://cdn2.tsccdn.com/wordpress/wp-content/plugins/mukioplayer-for-wordpress/static/MukioPlayerPlus.swf?'+flashvars_html+'\',\'newwindow\',\'width=960,height=500\')" href="javascript:;">新窗口播放</a><embed src="' + list[index]['player'] + '" width="' + list[index]['width'] + '" height="' + list[index]['height'] + '" type="application/x-shockwave-flash" quality="high" allowfullscreen="true"';
  playerstr += ' flashvars="' + flashvars_html + '&parentId=mkplayer-box"';
  playerstr += '></embed>';
  videofield.innerHTML = playerstr;
}