var dbgvar = null;
var gdb = null;

var app = angular.module('noteappModule', ['ngdexie']);

app.config(function(ngDexieProvider){
        ngDexieProvider.setOptions({name: 'notesDb', debug: false});
        ngDexieProvider.setConfiguration(function (db) {
            db.version(1).stores({
                notesStore: "++id,title,details",
            });
            db.on('error', function (err) {
                // Catch all uncatched DB-related errors and exceptions
                console.error("db error err=" + err);
            });
    });
});

app.controller("noteappController", ["$scope", "$timeout", "ngDexie", function ($scope, $timeout, ngDexie) {
  $scope.db = ngDexie.getDb();

  $scope.notesList = [];
  $scope.reReadNotesList = function() {
    ngDexie.list('notesStore').then(function(data){
        $scope.notesList = data;
    });
  }
  $scope.reReadNotesList();

  $scope.newNote = {title: '', details: ''};
  $scope.addNote = function(){
    ngDexie.put('notesStore', $scope.newNote).then(function(){
      $scope.newNote = {title: '', details: ''};
      $scope.reReadNotesList();
    });
  }

  $scope.clearNoteList = function(){
    ngDexie.getDb().notesStore.clear().then(function(data){
      $scope.reReadNotesList();
    });
  }

  // Row Actions
  $scope.editRow = function(evnt){
    this['$$isEditMode'] = 1;
    this["$$orginal"] = angular.copy(this.note);
  }
  $scope.abortEdit = function(evnt){
    this['$$isEditMode'] = 0;
    this.note = angular.copy(this["$$orginal"]);
    delete this["$$orginal"];
  }
  $scope.removeRow = function(evnt){
    ngDexie.getDb().notesStore.delete(this.note.id); //delete from db.
    $scope.notesList.splice(this.$index, 1);//delete from data.
  }
  $scope.saveRow = function(evnt){
    var noteToStore = {};
    angular.copy(this.note, noteToStore); //removes private attributes
    ngDexie.put('notesStore', noteToStore).then(function(){

    });
    this['$$isEditMode'] = 0;
  }

/*
  $scope.$watch("notesList", function(newValue, oldValue) {
    console.log(newValue, oldValue);
    if (newValue.length != oldValue.length) {
      $scope.reReadNotesList();
    }
});
*/

/*
$scope.someSpecialRequestThatCanNotBeDoneByNgDexie = function() {
  ngDexie.getDb().notesStore.toArray().then(function(data){
      $scope.notesList = data;
      $timeout(function(){}); //wait for the hashKey to be generated (http://stackoverflow.com/questions/23501230/add-hashkey-to-object-in-angular)
  });
}
*/

}]);
