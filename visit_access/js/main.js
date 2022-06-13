(function () {
	"use strict";

	var treeviewMenu = $('.app-menu');

	// Toggle Sidebar
	$('[data-toggle="sidebar"]').click(function(event) {
		event.preventDefault();
		$('.app').toggleClass('sidenav-toggled');
	});

	// Activate sidebar treeview toggle
	$("[data-toggle='treeview']").click(function(event) {
		event.preventDefault();
		if(!$(this).parent().hasClass('is-expanded')) {
			treeviewMenu.find("[data-toggle='treeview']").parent().removeClass('is-expanded');
		}
		$(this).parent().toggleClass('is-expanded');
	});

	// Set initial active toggle
	$("[data-toggle='treeview.'].is-expanded").parent().toggleClass('is-expanded');

	//Activate bootstrip tooltips
	$("[data-toggle='tooltip']").tooltip();

})();
$('ul.app-menu .app-menu__item').click(function () {
    var padre = '';
    padre = '<li class="breadcrumb-item"><i class="fa fa-home fa-lg"></i></li>' +
        '<li class="breadcrumb-item"><a href="#!">' + $(this).text() + '</a></li>';

    $('ul.app-menu .app-menu__item.active').removeClass('active');

    if (!$(this).parent().hasClass('treeview'))
        $('ul.app-menu > li.treeview.is-expanded').removeClass('is-expanded');

    //this not have parent
    if (!$(this).parent().hasClass('treeview')) {
        $(this).addClass('active');
        $('main.app-content > div.active').removeClass('active');
        $('main.app-content > div' + $(this).attr('data-tab')).addClass('active');
        $('ul.treeview-menu .treeview-item i.fa-dot-circle-o').addClass('fa-circle-o').removeClass('fa-dot-circle-o');
        //SET PATH
        $('ul.app-breadcrumb.breadcrumb').html(padre);
        //$(document).resize();
    }


});

$('ul.treeview-menu .treeview-item').click(function () {
    $('ul.treeview-menu .treeview-item i.fa-dot-circle-o').addClass('fa-circle-o').removeClass('fa-dot-circle-o');
    $(this).find('i').removeClass('fa-circle-o');
    $(this).find('i').addClass('fa-dot-circle-o');
    $('main.app-content > div.active').removeClass('active');
    $('main.app-content > div' + $(this).attr('data-tab')).addClass('active');

    var padre = '';
    padre = '<li class="breadcrumb-item"><i class="fa fa-home fa-lg"></i></li>' +
        '<li class="breadcrumb-item"><a href="#!">' + $('ul.app-menu .app-menu__item.active').text() +
        $('ul.app-menu > li.treeview.is-expanded .app-menu__item').text() + '</a></li>' +
        '<li class="breadcrumb-item"><a href="#!">' + $('ul.treeview-menu .treeview-item i.fa-dot-circle-o').parent().text() + '</a></li>';
    //SET PATH
    $('ul.app-breadcrumb.breadcrumb').html(padre);
    $(document).resize();
});