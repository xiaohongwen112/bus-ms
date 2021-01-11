/* eslint-disable */
	// import devServerConfig from '@/../config/devServer';
	import axios from 'axios';
	axios({
		method: 'get',
		url: '/zh-cn/get_token/',
	}).then((res) => {
		// console.log(res.data.data);
		const token = window.csrfLogin = res.data.data.csrfmiddlewaretoken;
		document.getElementById('token').value = token;
	}).catch()
  var bgImg = document.getElementById('login-bgImg');
	function onResize() {
		var bg = document.getElementById('login-bg');
		// var bgImg = document.getElementById('login-bgImg');
		var mixWidth = Math.max(window.innerHeight * 2, window.innerWidth) - 2;
		bgImg.style.width= `${mixWidth}px`;
		if (window.innerWidth > window.innerHeight * 2 ) {
            bg.style.top= `-${window.innerWidth / 2 - window.innerHeight}px`;
            bg.style.left = 0;
        } else if (window.innerWidth < window.innerHeight * 2 ) {
			bg.style.left= `-${window.innerHeight - window.innerWidth / 2}px`;
            bg.style.top = 0;
		}
		// console.log(mixWidth, window.innerHeight, window.innerWidth);
	}
	
	// bgImg.src = './login-bg5.gif';
	var timer = window.setTimeout(function() {
		bgImg.src = '/static/registration/login-bg5.gif';
		window.clearTimeout(timer);
	},1);
	onResize();
	window.addEventListener('resize', onResize);
	var statusIcon = document.getElementById('keep-status-icon');
	statusIcon.addEventListener('click', function(e) {
		var bool = this.getAttribute('data-checked') === 'false';
		console.log(e, bool);
		statusIcon.setAttribute('data-checked', bool);
		// checked;
		if (bool) {
			// add
			statusIcon.classList.add('checked');
		} else {
			statusIcon.className = 'keep-status-icon';
		}
	});

	// submit
	function toVaild() {
		console.log('submit');
		var username = document.getElementById('username');
		var usernameVal = username.value.trimLeft().trimRight();
		var password = document.getElementById('password');
		var passwordVal = password.value.trimLeft().trimRight();
		// 校验
		var res = false;
		var error_div = document.getElementById('error_div');
		if (['', null].includes(usernameVal) || ['', null].includes(passwordVal)) {
			error_div.style.display = 'block';
			res = false;
		} else {
			error_div.style.display = 'none';
			res = true;
		}
		return res;
	}