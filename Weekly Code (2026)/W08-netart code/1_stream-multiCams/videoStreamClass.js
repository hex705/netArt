class RemoteVideoStream {

    constructor( stream, _w, _h, _id){
        this.video = stream;
        this.width = _w;
        this.height = _h;
        this.id = _id;

        this.displayState = 1;
        // partially redundant
        this.x=0;
        this.y=0;
        this.width=400;
        this.height=300;

        //otherVideo.id and id are the same and unique identifier
        this.video.hide();

      } // end stream constructor
    
  show(dims){
    if (this.video != null){
      image(this.video,dims.x,dims.y,this.width,this.height);
    } 
   }

} // end class 
