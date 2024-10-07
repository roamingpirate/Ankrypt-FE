export default {
  podcast: {
    couchPodcast: {
        sceneName : "PodcastScene_2",
        fullView: {
            position: [-1.8, -0.7, -3.78],
            rotation: [0.3, -2.28, 0],
        },
        speaker1View : {
            position: [-0.1, -1, -1],
            rotation: [0.1, -2.8, 0],         
        },
        speaker2View : {
            position: [-2.2, -1.2, -0.1],
            rotation: [0.1, -2.0, 0],         
        },
        modelPositions :[
          {
            position: [-0.3,0,-0.1],
            rotation: [0,2.7,0],        
          },
          {
            position: [-1.7,0,-1.6],
            rotation: [0,1.9,0],   
          }
        ]
    },
  },
};



/*

VideoData ->

    View-> speakerView, FullView;
    Speakers : (array) -> {
          name, 
          index
    }
    videoType,
    Enviornment,

*/
