$(function(){
	var searchQuery, url, nextPage, retryCount = 0,
		appID = 'b93756e565794360942f1eba0831c90c';


	var doSearch = function(url){
		$.ajax({
			url : url,
			dataType : 'jsonp',
			success : processRequest
		});
	}

	var processRequest = function(data){
		var videoArr = [];
		if(data.meta.code !== 200){
			errorStatus('Oops, something went wrong. Try again!');
			return false;
		}
		//update URL
		url = data.pagination.next_url;

		for(var i = 0; i < data.data.length; i++ ){
			if(data.data[i].type === 'video'){
				console.log('video!');
				videoArr.push(data.data[i]);
			}
		}
		if(videoArr.length === 0){
			retryCount++;
			if(retryCount < 5){
				doSearch(url);
			} else {
				errorStatus('Sorry, no videos there.  Try again!');
			}
		} else {
			printVids(videoArr);
		}
	}

	var errorStatus = function(error){
		$('.error').text(error);
	}

	var printVids = function(videoArr){
		var thumbnail, userphoto, username, videoUrl, likes, caption, likes;
		for(var i = 0; i < videoArr.length; i++){
			thumbnail = videoArr[i].images.standard_resolution.url,
			userphoto = videoArr[i].user.profile_picture,
			username = videoArr[i].user.username,
			videoUrl = videoArr[i].videos.standard_resolution.url,
			caption = videoArr[i].caption ? videoArr[i].caption.text : '',
			likes = videoArr[i].likes.count;

			$('.video-container').append('<div class="item"><div class="media-wrapper" data-video="'+videoUrl+'"><img src="'+thumbnail+'"><div class="controls"></div></div><div class="meta"><div class="user group"><img src="'+userphoto+'"><span class="name">'+username+'</span></div><div class="caption"><p>'+caption+'</p></div><div class="likes"><p><span class="icon-heart-fill"></span>'+likes+'</p></div></div><div class="divider"></div></div>');
		}
		$('#main').addClass('active');

		$('.item').removeClass('last').eq(-1).addClass('last');
	}

	$('#photo-search').on({
		submit : function(e){
			searchQuery = $('#search').val();
			//remove hash or user @
			if(searchQuery.slice(0,1) === '#' || searchQuery.slice(0,1) === '@' ){
				searchQuery = searchQuery.substring(1);
			}

			//remove whitespace
			searchQuery = searchQuery.replace(/\s+/g, '');

			url = 'https://api.instagram.com/v1/tags/' + searchQuery + '/media/recent?client_id=' + appID + '&count=30';
			$('.video-container').empty();
			retryCount = 0;
			$('.error').empty();
			$('#main').removeClass('active');
			doSearch(url);
			return false;
		}
	});

	$('.video-container').on({
		click: function(){
			var videoUrl = $(this).data('video');
			if(!$(this).hasClass('playing') && !$(this).hasClass('paused')){
				$(this).addClass('playing');
				$(this).append('<video autoplay loop name="media"><source src="'+videoUrl+'" type="video/mp4"></video>');
			} else if($(this).hasClass('playing')) {
				$(this).find('video')[0].pause();
				$(this).removeClass('playing').addClass('paused');
			} else {
				$(this).find('video')[0].play();
				$(this).removeClass('paused').addClass('playing');
			}
		}
	}, '.media-wrapper');

	$('#search').on({
		focus : function(){
			$(this).parent().addClass('focus');
		},
		blur : function(){
			if($(this).val() === ''){
				$(this).parent().removeClass('focus');
			}
		}
	})

	$('.load-more').on({
		click : function(){
			doSearch(url);
		}
	});

	if(Modernizr.video.h264 === ''){
		errorStatus('Sorry, your browser does not support mp4 video :(');
	}

});
