

AclEditorDialog = function( id, modalDivId )
{
  var arg = arguments;
  SimpleDialog.apply( this, arguments );
  this.constructor = AclEditorDialog;
  
  this.aclEditorCtrl = new AclEditorCtrl();
  this.setClientContent( this.aclEditorCtrl ); 
  this.addBtns();
};

AclEditorDialog.prototype = new SimpleDialog();

AclEditorDialog.prototype.getAclEditorCtrl = function()
{
  return this.aclEditorCtrl;
};

// TODO sbarkdull, localize
/*private static*/AclEditorDialog.OK_TEXT = Messages.getString( "OK" );
/*private static*/AclEditorDialog.CANCEL_TEXT = Messages.getString( "CANCEL" );
/*private static*/AclEditorDialog.BUTTON_WIDTH = (AclEditorDialog.CANCEL_TEXT.length + 2) + "ex";

/*private*/AclEditorDialog.prototype.addBtns = function()
{
  var table = document.createElement( "table" );
	table.cellSpacing = "0";
	table.cellPadding = "0";
	table.style.width = "100%";
	var tbody = document.createElement( "tbody" );
	table.appendChild( tbody );
	
	// button row
	var tr = document.createElement( "tr" );
	tbody.appendChild( tr );
	// empty left cell
	var td = document.createElement( "td" );
	td.style.width = "60%";
	tr.appendChild( td );
	
	// ok button cell
	td = document.createElement( "td" );
	td.style.width = AclEditorDialog.BUTTON_WIDTH;
	td.style.paddingRight = ".5em";
	tr.appendChild( td );
	
	var localThis = this;
	
	var btnCtrl = new ButtonCtrl( AclEditorDialog.OK_TEXT, ButtonCtrl.LARGE );
	btnCtrl.setOnClickCallback(
    function()
    {
      var event = UIUtil.getEvent( arguments );
      localThis.save( event );
    },
    this );
  td.appendChild( btnCtrl.getRoot() );
  this.okBtnCtrl = btnCtrl;
	
	// cancel btn cell
	td = document.createElement( "td" );
	td.style.width = AclEditorDialog.BUTTON_WIDTH;
	td.style.paddingLeft = ".5em";
	tr.appendChild( td );
	
	var btnCtrl = new ButtonCtrl( AclEditorDialog.CANCEL_TEXT, ButtonCtrl.LARGE );
	btnCtrl.setOnClickCallback(
    function()
    {
      var event = UIUtil.getEvent( arguments );
      localThis.cancel();
    },
    this );
  td.appendChild( btnCtrl.getRoot() );
  this.cancelBtnCtrl = btnCtrl;
	this.setBtnContent( table );
};

AclEditorDialog.prototype.enableOkBtnEl = function( enable )
{
  this.okBtnCtrl.setEnabled( enable );
};

AclEditorDialog.prototype.enableCancelBtnEl = function( enable )
{
  this.cancelBtnCtrl.setEnabled( enable );
};

AclEditorDialog.prototype.setOnSaveHandler = function( handler )
{
  this.onSaveHandler = handler;
};
       
AclEditorDialog.prototype.save = function( event )
{
  if ( this.onSaveHandler )
  {
    this.onSaveHandler( event );
  }
};

AclEditorDialog.prototype.setOnCancelHandler = function( handler )
{
  this.onCancelHandler = handler;
};
       
AclEditorDialog.prototype.cancel = function( event )
{
  if ( this.onCancelHandler )
  {
    this.onCancelHandler( event );
  }
};

