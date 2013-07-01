BusyCtrl = function()
{
	HTMLCtrl.call( this, "span" );
	this.constructor = BusyCtrl;
	
	var rootSpan = this.getRoot();
	rootSpan.style.visibility = "hidden";
	rootSpan.style.verticalAlign = "middle";
	
	var workingSpan = document.createElement( "span" );
	rootSpan.appendChild( workingSpan );
	workingSpan.innerHTML = "Working ...";
	this.workingSpan = workingSpan;
	
	var img = document.createElement( "img" );
	rootSpan.appendChild( img );
	img.src = UIUtil.getImageFolderPath() + "pentaho_timer.gif";
}
BusyCtrl.prototype = new HTMLCtrl();

BusyCtrl.prototype.show = function()
{
	this.getRoot().style.visibility = "visible";
}
BusyCtrl.prototype.hide = function()
{
	this.getRoot().style.visibility = "hidden";
}
BusyCtrl.prototype.setText = function( msg )
{
	this.workingSpan.innerHTML = msg;
}