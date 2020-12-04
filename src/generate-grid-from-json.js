function generateGridFromJson(src) {

    return new Promise((resolve) => {
    //   let canvas = document.createElement('canvas')
    //   let json = document.createElement('img')
  
    //   json.src = src
  
    //   json.onload = function() {
  
    //     canvas.width  = width
    //     canvas.height = height
    //     canvas.getContext('2d').drawImage(json, 0, 0, width, height)
  
    //     let grid = []
    //     for (let y = 0; y < height; y++) {
    //       if (!grid[y]) grid[y] = []
    //       for (let x = 0; x < width; x++) {
    //         let data = canvas.getContext('2d').getImageData(x, y, 1, 1).data
  
    //         if (data[0] < 128 && data[1] < 128 && data[2] < 128) {
    //           grid[y][x] = 1
    //         } else {
    //           grid[y][x] = 0
    //         }
  
    //       }
    //     }
  
    //     resolve(grid)
  
    //   }
    let grid = [
        [0,0,0,1,1,1,1,0,0,0],
        [0,0,1,0,0,1,1,1,0,0],
        [1,1,1,1,1,1,1,1,1,1],
        [0,1,0,1,0,0,1,0,1,0],
        [1,0,0,0,1,1,0,0,0,1],
        [1,0,0,0,1,1,0,0,0,1],
        [0,1,0,1,0,0,1,0,1,0],
        [0,1,0,0,1,1,0,0,1,0],
        [0,0,1,0,0,0,0,1,0,0],
        [0,1,1,1,1,1,1,1,1,0],
      ]
      resolve(grid)
    })
  
  }
  
  module.exports = generateGridFromJson