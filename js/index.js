;(function() {
	'use strict';
	var $form_add_task=$('.add-task')
		,task_list=[]
		,$delete_task
		;

	init();

	$form_add_task.on('submit',on_add_task_form_submit);

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

	function listion_task_delete() {
			$delete_task.on('click',function () {
			var $this=$(this);
			var $item = $this.parent().parent();
			console.log($item);
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
		console.log(task_list);
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
			var $task = render_task_item(task_list[i],i);
			$task_list.append($task);
		}
		$delete_task = $('.action.delete');
		listion_task_delete();
	}

	function render_task_item(data,index) {
		if(!data || !index) return;
		var list_item_tpl='<div class="task-item" data-index="'+index+'">'+
			'<span><input type="checkbox"></span>'+
			'<span class="task-content">'+data.content+'</span>'+
			'<span class="fr">'+
			'<span class="action delete"> 删除</span>'+
			'<span class="action"> 详请</span>'+
			'</span>'+
			'</div>';	
			return list_item_tpl;	
	}
})();