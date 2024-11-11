/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2024 by Hitachi Vantara, LLC : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2028-08-13
 ******************************************************************************/


/**
* This controller simply allows the dialog to pass back three parameters:
* 1. solution
* 2. path
* 3. saveAs name
*
* It is up to the calling alpplication to decide what to do with the parameters. 
*/ 

PivotRepositoryBrowserController = function()
{
  var localThis = this;
	this.solutionRepository = new SolutionRepository();
  var rootFolderPathData = { 
  	  isDir: true,
  	  solution: SolutionRepository.EMPTY_SOLUTION_NAME,
  	  path: SolutionRepository.EMPTY_FOLDER, 
  	  name: SolutionRepository.ROOT_FOLDER, 
  	  displayName: SolutionRepository.ROOT_FOLDER,
  	  description: Messages.getString("SOLUTION_REPOSITORY")
    };
    
	this.repositoryBrowser = new RepositoryBrowser(Messages.getString("saveAsBtnTxt"), this.solutionRepository, 
    rootFolderPathData,
		function( solution, path )
		{
		  localThis.handleFolderChange( solution, path );
		}
	);
	
	this.repositoryBrowser.setOnSaveHandler( this.handleSave, this );
	this.repositoryBrowser.setOnCancelHandler( this.handleCancel, this );

	this.solution = null;
	this.path = null;
	this.saveAsName = null;
	this.title = null;
	this.onAfterSaveCallback = null;

}

/*static*/PivotRepositoryBrowserController.RE_FILE_FILTER = /.*\.xaction/;
// match everything that start with a '/' EXCEPT /admin and /system
/*static*/PivotRepositoryBrowserController.RE_FOLDER_FILTER = /^\/(?!admin|system)/;
/*static*/PivotRepositoryBrowserController.RE_PIVOT_EXTENSION = /(.*)\.xaction/;
/*static*/PivotRepositoryBrowserController.RE_VALID_FILENAME = /[\/\\\?%*:|<>]/;

PivotRepositoryBrowserController.prototype.getSolution = function( )
{
	return this.solution;
}

PivotRepositoryBrowserController.prototype.getActionPath = function( )
{
	return this.path;
}

PivotRepositoryBrowserController.prototype.getActionName = function( )
{
	return this.saveAsName;
}
PivotRepositoryBrowserController.prototype.getActionTitle = function( )
{
	return this.title;
}

PivotRepositoryBrowserController.isValidFilename = function( filename )	
{
	var match = filename.match( PivotRepositoryBrowserController.RE_VALID_FILENAME );
	return null == match;
}
PivotRepositoryBrowserController.prototype.handleSave = function()
{
	if ( this.repositoryBrowser.getMode() == RepositoryBrowser.SAVE_MODE  )
	{
		var saveAsName = this.repositoryBrowser.getSaveAsName();
		var matchRes = saveAsName.match( PivotRepositoryBrowserController.RE_PIVOT_EXTENSION );
		if ( matchRes != null )
		{
			saveAsName = matchRes[ 1 ];	// trim off the extension
		}
		var title = saveAsName;
		var solution = this.repositoryBrowser.getSolutionName();
		var path = this.repositoryBrowser.getPath();
		
		var bSaveOk = this.saveAs( saveAsName, title, solution, path, false );
		
		return bSaveOk;
	}
	return false;
}

PivotRepositoryBrowserController.prototype.handleCancel = function()
{
}

PivotRepositoryBrowserController.prototype.handleFolderChange = function( solution, path )
{
  var localThis = this;
	this.solutionRepository.getSolutionFolderChildren( solution, path, 
		PivotRepositoryBrowserController.RE_FILE_FILTER, /*async*/true,
		function( children )
		{
			localThis.repositoryBrowser.loadListCtrl( children );
      localThis.repositoryBrowser.tryToEnableSaveBtn();
		}
	);
};
PivotRepositoryBrowserController.prototype.saveAs = function( saveAsName,
	title, solution, path, bOverwrite )
{
	/*
	 * if bOverwrite is false, check to see if the file exists in the repository. If
	 * the file doesn't exist, we can safely set bOverwrite to false, that way if the file
	 * gets somehow gets created by another process before we save, the server will still
	 * detect it and return an error msg preventing an overwrite.
	 * If the file does exist, prompt the user for overwrite.
	 */
	if ( !bOverwrite )
	{
		var repositoryPath = "/" + solution + "/" + path + "/" + saveAsName + ".xaction"
		var bExists = this.solutionRepository.doesSolutionFileExist( repositoryPath );
		if ( bExists )
		{
			bOverwrite = window.confirm(Messages.getString("overwriteFile", saveAsName));
			if ( !bOverwrite )
			{
				return;
			}
		}
		else
		{
			bOverwrite = false;
		}
	}
	
	if ( PivotRepositoryBrowserController.isValidFilename( saveAsName ) )
	{

		this.solution = solution;
		this.path = path;
		this.saveAsName = saveAsName;
		this.title = title;

		if ( this.onAfterSaveCallback )
		{
			this.onAfterSaveCallback()
		}

		return true;
	}
	else
	{
		window.alert(Messages.getString("invalidFileName", saveAsName));
		return false;
	}
}

	
PivotRepositoryBrowserController.prototype.open = function()
{
	this.repositoryBrowser.show();
}

/**
 * @throws Status when the report spec is not valid and cannot be saved
 */
PivotRepositoryBrowserController.prototype.save = function()
{
	if ( StringUtils.isEmpty( this.solution ) 
		|| StringUtils.isEmpty( this.saveAsName ) )
	{
		this.open()
	}
	else
	{
		// this.path better be non-empty too!
		this.saveAs( this.saveAsName, this.title , this.solution, this.path, true );
	}
}

PivotRepositoryBrowserController.prototype.reset = function()
{
	this.solution = null;
	this.path = null;
	this.saveAsName = null;
	this.title = null;
}
var onAfterSaveCallback_ptr;
var controller_ptr;

PivotRepositoryBrowserController.prototype.setOnAfterSaveCallback = function( callback )
{
// register with mantle
  if(window.parent && window.parent.mantle_initialized == true){
      window.parent.enableSave( true );
  }


	this.onAfterSaveCallback = callback;
	onAfterSaveCallback_ptr = callback;
	controller_ptr = this;
}
