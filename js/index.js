;(function() {
	'use strict';
	var $form_add_task=$('.add-task')
		,task_list=[]
		,$task_delete_trriger
		,$task_detail_trriger
		,$task_detail = $('.task-detail')
		,$task_detail_mask=$('.task-detail-mask')
		,current_index
		,$update_form
		,$task_detail_content
		,$task_detail_content_input
		;

	init();

	$form_add_task.on('submit',on_add_task_form_submit);
	$task_detail_mask.on('click',hide_task_detail);

	function on_add_task_form_submit(e) {
		var new_task={},$input;
		// 禁用默认行为
		e.preventDefault();
		$input=$(this).find('input[name=content]')
		new_task.content=$input.val();
		if(!new_task.content) return;

		if(add_task(new_task)){
			render_task_list();
			$input.val(null);
		}
	}

	function listen_task_detail() {
		var index;
		$('.task-item').on('dblclick',function(){
			index = $(this).data('index');
			show_task_detail(index);

		});

		$task_detail_trriger.on('click',function () {
			var $this=$(this);
			var $item = $this.parent().parent();
			index = $item.data('index');
			show_task_detail(index);
		})
	}

	function show_task_detail(index) {
		render_task_detail(index);
		current_index = index;
		$task_detail.show();
		$task_detail_mask.show();
	}

	function update_task(index,data) {
		if(!index || !task_list[index])
			return;
		task_list[index] = data;
		console.log(task_list);
		refresh_task_list();
	}

	function hide_task_detail() {
		$task_detail.hide();
		$task_detail_mask.hide();
	}


	function render_task_detail(index) {
		if(index === undefined || !task_list[index])
			return;
		var item = task_list[index];
		var tpl ='<form>'
				+'<div class="content">'
				+item.content
				+'</div>'
				+'<div>'
				+'<input style="display:none;" type="text" name="content" value ="'+(item.content || " ") +'" />'
				+'</div>'
				+'<div>'
			    +'<div class="desc">'
				+'<textarea name="desc" cols="20" rows="10">'+ (item.desc || " ") +'</textarea>'
				+'</div>'
				+'</div>'
				+'<div class="remind">'
				+'<input name="remind_date" type="date">'
				+'</div>'
				+'<div><button type="submit">更新</button></div>'
				+'</form>';
		$task_detail.html(null);
		$task_detail.html(tpl);
		$update_form=$task_detail.find('form');
		$task_detail_content = $update_form.find('.content');
		$task_detail_content_input = $update_form.find('[name=content]');


		$task_detail_content.on('dblclick',function () {
			console.log('1');
			$task_detail_content_input.show();
			$task_detail_content.hide();
		})

		$update_form.on('submit',function (e) {
			e.preventDefault();
			var data = {};
			data.content=$(this).find('[name=content]').val();
			data.desc = $(this).find('[name=desc]').val();
			data.remind_date=$(this).find('[name=remind_date]').val();
			update_task(current_index,data);
		})

	}

	function listen_task_delete() {
			$task_delete_trriger.on('click',function () {
			var $this=$(this);
			var $item = $this.parent().parent();
			var index = $item.data('index');
			var tmp= confirm('确定删除？');
			tmp ? delete_task(index) : null;
		})
	}


	function add_task(new_task) {
		task_list.push(new_task);
		store.set('task_list',task_list);
		return true;
	}

	function refresh_task_list() {
		store.set('task_list',task_list);
		render_task_list(); 
	}

	function delete_task(index) {
		if(index === undefined || !task_list[index]) return;
		delete task_list[index];
		refresh_task_list();		
	}

	function init() {
		task_list = store.get('task_list') || [];
		if(task_list.length){
			render_task_list();
		}
	}

	function render_task_list() {
		var $task_list=$('.task-list');
		$task_list.html('');
		for (var i = 0; i < task_list.length; i++) {
			console.log(i);
			var $task = render_task_item(task_list[i],i);
			$task_list.prepend($task);
		}
		$task_delete_trriger = $('.action.delete');
		$task_detail_trriger = $('.action.detail');
		listen_task_delete();
		listen_task_detail();
	}

	function render_task_item(data,index) {
		if(!data) return;
		var list_item_tpl='<div class="task-item" data-index="'+index+'">'+
			'<span><input type="checkbox"></span>'+
			'<span class="task-content">'+data.content+'</span>'+
			'<span class="fr">'+
			'<span class="action delete"> 删除</span>'+
			'<span class="action detail"> 详请</span>'+
			'</span>'+
			'</div>';	
			return list_item_tpl;	
	}
})();