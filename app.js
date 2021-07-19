(function () { function r(e, n, t) { function o(i, f) { if (!n[i]) { if (!e[i]) { var c = "function" == typeof require && require; if (!f && c) return c(i, !0); if (u) return u(i, !0); var a = new Error("Cannot find module '" + i + "'"); throw a.code = "MODULE_NOT_FOUND", a } var p = n[i] = { exports: {} }; e[i][0].call(p.exports, function (r) { var n = e[i][1][r]; return o(n || r) }, p, p.exports, r, e, n, t) } return n[i].exports } for (var u = "function" == typeof require && require, i = 0; i < t.length; i++)o(t[i]); return o } return r })()({
  1: [function (require, module, exports) {
    let drawInputGrid = require('./draw-input-grid')
    let drawOutputGrid = require('./draw-output-grid')
    let solver = require('./solver')
    let generateClues = require('./generate-clues')
    let handleMouseEvent = require('./handle-mouse-event')
    let resizeGrid = require('./resize-grid')
    let exportGrid = require('./export-grid')
    let generateGridFromImage = require('./generate-grid-from-image')
    let generateGridFromJson = require('./generate-grid-from-json')


    let container = document.getElementById('container')

    let widthInput = container.querySelector('input[name="width"]')
    let heightInput = container.querySelector('input[name="height"]')
    let fileInput = container.querySelector('input[name="file"]')
    let jsonInput = container.querySelector('input[name="jsonFile"]')

    let clearBtn = container.querySelector('button[name="clear"]')
    let invertBtn = container.querySelector('button[name="invert"]')
    let imageBtn = container.querySelector('button[name="image"]')
    let importCodeBtn = container.querySelector('button[name="importCode"]')
    let importJSONBtn = container.querySelector('button[name="importJson"]')
    let exportJSONBtn = container.querySelector('button[name="exportJson"]')
    let exportPNGBtn = container.querySelector('button[name="exportPng"]')
    let saveBtn = container.querySelector('button[name="save"]')
    let nextBtn = container.querySelector('button[name="next"]')
    let nextCounter = 0;
    let historyGrids = [];


    let inputCanvas = container.querySelector('#input-grid canvas')
    let outputCanvas = container.querySelector('#output-grid canvas')

    let inputCtx = inputCanvas.getContext('2d')
    let outputCtx = outputCanvas.getContext('2d')

    var firebaseConfig = {
      apiKey: "AIzaSyDumtrL-VHq_aUzXKu2P8anOm4st3er5z8",
      authDomain: "nonograms-db.firebaseapp.com",
      projectId: "nonograms-db",
      storageBucket: "nonograms-db.appspot.com",
      messagingSenderId: "39621201819",
      appId: "1:39621201819:web:e49002c80f7cfc9eed9b3e",
      measurementId: "G-327GVPRSNZ"
    };
    let db;

    let grid = [
      [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
      [0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1],
      [0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
      [0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
      [0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0],
      [0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0],
      [0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0]
    ]

    inputCanvas.addEventListener('contextmenu', function (e) {
      e.preventDefault()
    })

    inputCanvas.addEventListener('mousedown', function (e) {
      handleMouseEvent(e, grid, inputCanvas.width, inputCanvas.height)
      drawInputGrid(grid, inputCanvas, inputCtx)
    })

    inputCanvas.addEventListener('mousemove', function (e) {
      handleMouseEvent(e, grid, inputCanvas.width, inputCanvas.height)
      drawInputGrid(grid, inputCanvas, inputCtx)
    })

    inputCanvas.addEventListener('mouseup', function (e) {
      if (!container.classList.contains('calculating')) {
        calculate()
      }
    })

    widthInput.addEventListener('change', function (e) {
      resizeGrid(parseInt(e.target.value), grid.length, grid)
      drawInputGrid(grid, inputCanvas, inputCtx)
      calculate()
    })

    heightInput.addEventListener('change', function (e) {
      resizeGrid(grid[0].length, parseInt(e.target.value), grid)
      drawInputGrid(grid, inputCanvas, inputCtx)
      calculate()
    })

    clearBtn.addEventListener('click', function (e) {
      grid = grid.map(row => row.map(() => 0))
      drawInputGrid(grid, inputCanvas, inputCtx)
      calculate()
    })

    invertBtn.addEventListener('click', function (e) {
      grid = grid.map(row => row.map(cell => cell == 1 ? 0 : 1))
      drawInputGrid(grid, inputCanvas, inputCtx)
      calculate()
    })

    importCodeBtn.addEventListener('click', function (e) {
      Swal.fire({
        title: 'Enter nonogram code:',
        input: 'text',
        inputAttributes: {
          autocapitalize: 'off',
          id: 'loadInput'
        },
        showCancelButton: true,
        confirmButtonText: 'Start',
        showLoaderOnConfirm: true,
        preConfirm: (login) => {
          try {
            if (login == "") {
              throw new Error("That field in required!");
            }
            else {
              const server = db.doc(login);
              return server.get().then(nonogram => {
                nonogram = nonogram.data();
                if (nonogram == undefined) {
                  Swal.showValidationMessage(
                    `Error: Nonogram not exist !`
                  )
                }
                else {
                  return (nonogram);
                }
              })
            }
          }
          catch (error) {
            Swal.showValidationMessage(
              error
            )
          }
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then(async (result) => {
        if (result.value.grid == undefined) {
          Swal.fire({
            icon: "error",
            title: `I coulnd't find ur nonogram =,(`,
          })
        }
        else {
          Swal.fire({
            icon: 'success',
            title: 'Your nonogram has been imported !',
            showConfirmButton: false,
            timer: 1500
          })
          grid = await generateGridFromJson(result.value.grid);
          widthInput.value = grid[0].length;
          heightInput.value = grid.length;
          resizeGrid(grid[0].length, grid.length, grid)
          drawInputGrid(grid, inputCanvas, inputCtx)
          calculate()
        }
      })
    })




    importJSONBtn.addEventListener('click', function (e) {
      jsonInput.click()
    })

    jsonInput.addEventListener('change', function (e) {

      if (!e.target.files.length || !e.target.accept.includes(e.target.files[0].type)) return

      let fr = new FileReader()

      fr.addEventListener('load', async function () {
        grid = await generateGridFromJson(fr.result)
        drawInputGrid(grid, inputCanvas, inputCtx)
        calculate()
      })

      fr.readAsText(e.target.files[0])
      jsonInput.value = "";
    })

    imageBtn.addEventListener('click', function (e) {
      fileInput.click()
    })

    fileInput.addEventListener('change', function (e) {

      if (!e.target.files.length || !e.target.accept.includes(e.target.files[0].type)) return

      let fr = new FileReader()

      fr.addEventListener('load', async function () {
        grid = await generateGridFromImage(fr.result, widthInput.value, heightInput.value)
        drawInputGrid(grid, inputCanvas, inputCtx)
        calculate()
      })

      fr.readAsDataURL(e.target.files[0])
      fileInput.value = "";
    })

    exportPNGBtn.addEventListener('click', function (e) {
      exportGrid(grid, 'png')
    })

    exportJSONBtn.addEventListener('click', function (e) {
      exportGrid(grid, 'json')
    })

    saveBtn.addEventListener('click', function (e) {
      let gridString = '[\n   ' + grid.map(row => JSON.stringify(row)).join(',\n   ') + '\n]'
      let ogrid = [];
      for (let row in grid) {
        ogrid[row] = [];
        for (let col in grid[row]) {
          ogrid[row][col] = 0;
        }
      }
      let ogridString = '[\n   ' + ogrid.map(row => JSON.stringify(row)).join(',\n   ') + '\n]'
      db.add({
        Time: firebase.firestore.Timestamp.fromDate(new Date()),
        grid: gridString,
        ogrid: ogridString,
        isSavedNonogram: false
      })
        .then(function (docRef) {
          Swal.fire({
            icon: "success",
            title: 'your nonogram has been saved !',
            input: 'text',
            inputValue: docRef.id,
            inputAttributes: {
              autocapitalize: 'off',
              disabled: 'true',
              id: 'saveInput'
            },
            showCancelButton: true,
            confirmButtonText: 'copy',
            showLoaderOnConfirm: true,
            preConfirm: (id) => {
              console.log(id)
              var dummy = document.createElement("input");
              document.body.appendChild(dummy);
              dummy.setAttribute("id", "dummy_id");
              document.getElementById("dummy_id").value = id;
              dummy.select();
              document.execCommand("copy");
              document.body.removeChild(dummy);
            },
            allowOutsideClick: () => !Swal.isLoading()
          })
        })
    })

    nextBtn.addEventListener('click', async function (e) {
      if (nextCounter == 0) {
        historyGrids = await db.get().then(async (nonograms) => {
          nonograms = nonograms.docs.map(nonogram => nonogram.data());
          if (nonograms == undefined) {
            alert("there is no nonograms");
          }
          else {
            nonograms = nonograms.sort((a, b) => b.Time - a.Time)
            return nonograms;
          }
        })
      }
      while(historyGrids[nextCounter] != undefined && historyGrids[nextCounter].isSavedNonogram) {
        nextCounter++;
      }
      grid = await generateGridFromJson(historyGrids[nextCounter].grid);
      widthInput.value = grid[0].length;
      heightInput.value = grid.length;
      nextCounter++;
      resizeGrid(grid[0].length, grid.length, grid)
      drawInputGrid(grid, inputCanvas, inputCtx)
      calculate()

      // Copy image to clipboard
      // inputCanvas.toBlob(blob => navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]));

      // Download img
      let a = document.createElement('a')
      let img = inputCanvas.toDataURL("image/png")
      a.setAttribute('href', 'data:image/png' + img)
      a.setAttribute('download', 'nonogram.png')
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
    })

    function calculate() {
      container.classList.add('calculating')

      setTimeout(function () {
        let { horizontalClues, verticalClues } = generateClues(grid)

        solver(grid[0].length, grid.length, horizontalClues, verticalClues)
          .then(solvedGrid => {
            drawOutputGrid(solvedGrid, horizontalClues, verticalClues, outputCanvas, outputCtx)
            container.classList.remove('calculating')
          })
      }, 50)
    }

    async function init() {
      firebase.initializeApp(firebaseConfig);
      firebase.analytics();
      db = firebase.firestore();
      db = db.collection("Nonograms");

      let { horizontalClues, verticalClues } = generateClues(grid)
      let solvedGrid = await solver(grid[0].length, grid.length, horizontalClues, verticalClues)

      drawInputGrid(grid, inputCanvas, inputCtx)
      drawOutputGrid(solvedGrid, horizontalClues, verticalClues, outputCanvas, outputCtx)
    }


















    init()
  }, { "./draw-input-grid": 2, "./draw-output-grid": 3, "./export-grid": 4, "./generate-clues": 5, "./generate-grid-from-image": 6, "./handle-mouse-event": 7, "./resize-grid": 8, "./solver": 9, "./generate-grid-from-json": 10 }], 2: [function (require, module, exports) {
    function drawInputGrid(grid, canvas, ctx) {

      canvas.width = canvas.width

      let dim = Math.floor(
        grid[0].length >= grid.length
          ? canvas.width / grid[0].length
          : canvas.height / grid.length
      )

      // Cells
      for (let y in grid) {
        for (let x in grid[y]) {

          ctx.strokeStyle = '#686868'
          ctx.lineWidth = 1.5
          ctx.strokeRect(x * dim, y * dim, dim, dim)

          if (grid[y][x] == 1) {
            ctx.fillStyle = '#000000'
            ctx.fillRect(x * dim, y * dim, dim, dim)
          }

        }
      }

      // Border
      ctx.strokeStyle = '#000000'
      ctx.strokeRect(0, 0, dim * grid[0].length, dim * grid.length)

    }

    module.exports = drawInputGrid
  }, {}], 3: [function (require, module, exports) {
    function drawOutputGrid(grid, horizontalClues, verticalClues, canvas, ctx) {

      canvas.width = canvas.width

      let dim = Math.floor(
        grid[0].length >= grid.length
          ? canvas.width / (grid[0].length * 1.5)
          : canvas.height / (grid.length * 1.5)
      )

      // Background
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Cells
      for (let y in grid) {
        for (let x in grid[y]) {

          ctx.strokeStyle = '#686868'
          ctx.strokeRect(canvas.width / 3 + x * dim, canvas.height / 3 + y * dim, dim, dim)

          switch (grid[y][x]) {
            case 0:
              ctx.fillStyle = '#FF0000'
              break

            case 1:
              ctx.fillStyle = '#000000'
              break

            default:
              ctx.fillStyle = '#FFFFFF'
              break
          }

          ctx.fillRect(canvas.width / 3 + x * dim, canvas.height / 3 + y * dim, dim, dim)

          if (grid[y][x] == 2) {
            ctx.beginPath()
            ctx.strokeStyle = '#FF0000'
            ctx.moveTo(
              canvas.width / 3 + x * dim + dim * 0.2,
              canvas.height / 3 + y * dim + dim * 0.2
            )
            ctx.lineTo(
              canvas.width / 3 + x * dim + dim - dim * 0.2,
              canvas.height / 3 + y * dim + dim - dim * 0.2
            )
            ctx.stroke()
            ctx.beginPath()
            ctx.strokeStyle = '#FF0000'
            ctx.moveTo(
              canvas.width / 3 + x * dim + dim - dim * 0.2,
              canvas.height / 3 + y * dim + dim * 0.2
            )
            ctx.lineTo(
              canvas.width / 3 + x * dim + dim * 0.2,
              canvas.height / 3 + y * dim + dim - dim * 0.2
            )
            ctx.stroke()
          }

        }
      }

      // Horizontal clues
      for (let y in grid) {
        horizontalClues[y].reverse()
        for (let x = 0; x < grid[y].length / 2; x++) {

          ctx.fillStyle = y % 2 == 0 ? '#DDDDDD' : '#EAEAEA'
          ctx.fillRect(
            canvas.width / 3 - x * dim - dim,
            canvas.height / 3 + y * dim,
            dim,
            dim
          )

          if (horizontalClues[y][x]) {
            ctx.font = dim * 0.7 + 'px Arial'
            ctx.fillStyle = '#000000'
            ctx.fillText(
              horizontalClues[y][x],
              canvas.width / 3 - x * dim - dim / 1.5,
              canvas.height / 3 + y * dim + dim / 1.5
            )
          }

        }

        if (!horizontalClues[y].length) {
          ctx.font = dim * 0.7 + 'px Arial'
          ctx.fillStyle = '#000000'
          ctx.fillText(
            0,
            canvas.width / 3 - dim / 1.5,
            canvas.height / 3 + y * dim + dim / 1.5
          )
        }
      }

      // Vertical clues
      for (let x in grid[0]) {
        verticalClues[x].reverse()
        for (let y = 0; y < grid.length / 2; y++) {

          ctx.fillStyle = x % 2 == 0 ? '#DDDDDD' : '#EAEAEA'
          ctx.fillRect(
            canvas.width / 3 + x * dim,
            canvas.height / 3 - y * dim - dim,
            dim,
            dim
          )

          if (verticalClues[x][y]) {
            ctx.font = dim * 0.7 + 'px Arial'
            ctx.fillStyle = '#000000'
            ctx.fillText(
              verticalClues[x][y],
              canvas.width / 3 + x * dim + dim / 3,
              canvas.height / 3 - y * dim - dim / 3
            )
          }
        }

        if (!verticalClues[x].length) {
          ctx.font = dim * 0.7 + 'px Arial'
          ctx.fillStyle = '#000000'
          ctx.fillText(
            0,
            canvas.width / 3 + x * dim + dim / 3,
            canvas.height / 3 - dim / 3
          )
        }
      }

      // Deviders
      for (let x = 0; x <= grid[0].length; x++) {
        if (x % 5 == 0) {
          ctx.beginPath()
          ctx.strokeStyle = '#000000'
          ctx.lineWidth = 1.5
          ctx.moveTo(canvas.width / 3 + x * dim, 0)
          ctx.lineTo(canvas.width / 3 + x * dim, canvas.height / 3 + dim * grid.length)
          ctx.stroke()
        }
      }

      for (let y = 0; y <= grid.length; y++) {
        if (y % 5 == 0) {
          ctx.beginPath()
          ctx.strokeStyle = '#000000'
          ctx.lineWidth = 1.5
          ctx.moveTo(0, canvas.height / 3 + y * dim)
          ctx.lineTo(canvas.width / 3 + dim * grid[0].length, canvas.height / 3 + y * dim)
          ctx.stroke()
        }
      }

    }

    module.exports = drawOutputGrid
  }, {}], 4: [function (require, module, exports) {
    let drawOutputGrid = require('./draw-output-grid')
    let generateClues = require('./generate-clues')

    function exportGrid(grid, type) {

      let a = document.createElement('a')

      if (type == 'png') {
        let canvas = document.createElement('canvas')
        let ctx = canvas.getContext('2d')
        let { horizontalClues, verticalClues } = generateClues(grid)
        let blankGrid = grid.map(row => row.map(() => 3))

        canvas.width = blankGrid[0].length * 100
        canvas.height = blankGrid.length * 100

        drawOutputGrid(blankGrid, horizontalClues, verticalClues, canvas, ctx)

        let img = canvas.toDataURL("image/png")

        a.setAttribute('href', 'data:image/png' + img)
        a.setAttribute('download', 'nonogram.png')

      } else if (type == 'json') {
        let gridString = '[\n   ' + grid.map(row => JSON.stringify(row)).join(',\n   ') + '\n]'

        a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(gridString))
        a.setAttribute('download', 'nonogram.json')
      }
      else if (type == 'txt') {
        let gridString = '[\n   ' + grid.map(row => JSON.stringify(row)).join(',\n   ') + '\n]'
        // gridString = gridString.replace(/1/g, "1a!s!d1");
        // gridString = gridString.replace(/0/g, "!a1s1d!");
        a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(gridString))
        a.setAttribute('download', 'nonogram.txt')
      }

      a.style.display = 'none'
      document.body.appendChild(a)

      a.click()

      document.body.removeChild(a)


    }

    module.exports = exportGrid
  }, { "./draw-output-grid": 3, "./generate-clues": 5 }], 5: [function (require, module, exports) {
    function generateClues(rows) {

      let cols = []
      for (let y in rows) {
        for (let x in rows[y]) {
          if (!cols[x]) cols[x] = []
          cols[x][y] = rows[y][x]
        }
      }

      return {
        horizontalClues: rows.map(row => row.join('').match(/1+/g) || []).map(row => row.map(line => line.length)),
        verticalClues: cols.map(col => col.join('').match(/1+/g) || []).map(col => col.map(line => line.length))
      }

    }

    module.exports = generateClues
  }, {}], 6: [function (require, module, exports) {
    function generateGridFromImage(src, width, height) {

      return new Promise((resolve) => {
        let canvas = document.createElement('canvas')
        let img = document.createElement('img')

        img.src = src

        img.onload = function () {

          canvas.width = width
          canvas.height = height
          canvas.getContext('2d').drawImage(img, 0, 0, width, height)

          let grid = []
          for (let y = 0; y < height; y++) {
            if (!grid[y]) grid[y] = []
            for (let x = 0; x < width; x++) {
              let data = canvas.getContext('2d').getImageData(x, y, 1, 1).data

              if (data[0] < 128 && data[1] < 128 && data[2] < 128) {
                grid[y][x] = 1
              } else {
                grid[y][x] = 0
              }

            }
          }

          resolve(grid)

        }
      })

    }

    module.exports = generateGridFromImage
  }, {}], 7: [function (require, module, exports) {
    function handleMouseEvent(e, grid, width, height) {

      if (e.buttons !== 1 && e.buttons !== 2) return

      let dim = Math.floor(grid[0].length >= grid.length ? width / grid[0].length : height / grid.length)

      for (let y in grid) {
        for (let x in grid[y]) {
          if (
            e.offsetX > x * dim && e.offsetX < x * dim + dim &&
            e.offsetY > y * dim && e.offsetY < y * dim + dim
          ) {
            grid[y][x] = e.buttons == 1 ? 1 : 0
          }
        }
      }

    }

    module.exports = handleMouseEvent
  }, {}], 8: [function (require, module, exports) {
    function resizeGrid(cols, rows, grid) {

      if (grid[0].length < cols) {
        for (let y in grid) {
          for (let x = 0; x < cols; x++) {
            if (grid[y][x] == undefined) grid[y][x] = 0
          }
        }
      } else if (grid[0].length > cols) {
        for (let y in grid) {
          grid[y] = grid[y].slice(0, cols)
        }
      }

      if (grid.length < rows) {
        for (let y = grid.length; y < rows; y++) {
          grid[y] = grid[0].map(() => 0)
        }

      } else if (grid.length > rows) {
        while (grid.length > rows) {
          grid.pop()
        }
      }

    }

    module.exports = resizeGrid
  }, {}], 9: [function (require, module, exports) {
    async function solver(cols, rows, horizontalClues, verticalClues) {

      let grid = []

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          if (!grid[y]) grid[y] = []
          grid[y][x] = 0
        }
      }

      let changed = true
      while (changed) {
        changed = false

        for (let x in grid[0]) {
          let col = []

          for (let y in grid) col.push(grid[y][x])

          col = solveRow(verticalClues[x], col)

          for (let y in grid) {
            if (col[y] != 0 && col[y] != grid[y][x]) changed = true
            grid[y][x] = col[y]
          }
        }

        for (let y in grid) {
          let row = grid[y].slice()
          row = solveRow(horizontalClues[y], row)

          for (let x in grid[0]) {
            if (row[x] != 0 && row[x] != grid[y][x]) changed = true
            grid[y] = row
          }
        }
      }

      return grid

    }

    function solveRow(clues, row) {

      let permutations = getPermutations(clues, row.length)
      let validPermutations = []

      permutations.forEach(permutation => {
        let valid = true

        for (let x = 0; x < row.length; x++) {
          if (row[x] != 0 && row[x] != permutation[x]) valid = false
        }

        if (valid) validPermutations.push(permutation)
      })

      let newRow = validPermutations[0].slice()
      validPermutations.forEach(permutation => {
        for (let x = 0; x < row.length; x++) {
          if (newRow[x] != permutation[x]) newRow[x] = 0
        }
      })

      return newRow

    }

    function getPermutations(clues, length) {

      if (!clues.length) {
        let row = []

        for (let x = 0; x < length; x++) row.push(2)

        return [row]
      }

      let permutations = []

      for (let i = 0; i < length - clues[0] + 1; i++) {
        let permutation = []

        for (let x = 0; x < i; x++) permutation.push(2)

        for (let x = i; x < i + clues[0]; x++) permutation.push(1)

        let x = i + clues[0]

        if (x < length) {
          permutation.push(2)
          x += 1
        }

        if (x == length && !clues.length) {
          permutations.push(permutation)
          break
        }

        let subRows = getPermutations(clues.slice(1, clues.length), length - x)

        for (let j in subRows) {
          subPermutation = permutation.slice()

          for (let k = x; k < length; k++) {
            subPermutation.push(subRows[j][k - x])
          }

          permutations.push(subPermutation)
        }

      }

      return permutations

    }

    module.exports = solver
  }, {}], 10: [function (require, module, exports) {
    function generateGridFromJson(src) {
      return new Promise((resolve) => {
        let clean = src.replace(/[ ,\[,\n]/g, "")
        clean = clean.slice(0, clean.length - 2)
        var grid = [];
        let counter = 0;
        grid[counter] = []
        for (let letter in clean) {
          if (clean[letter] == ']') {
            counter++;
            grid[counter] = []
          }
          else {
            grid[counter].push(clean[letter] * 1)
          }
        }
        resolve(grid)
      })
    }

    module.exports = generateGridFromJson
  }, {}]
}, {}, [1]);
