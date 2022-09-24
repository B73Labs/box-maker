let width;
let height;
let depth;

let viewBoxWidth = 800; // default viewBoxWidth
let viewBoxHeight = 500; // default viewBoxHeight
let paddingAmt = 5;

let offset = 20; // used for window size

let scale = 72; // scale to export correctly for inches

function generateBox() {
    let widthIn = parseFloat($('#width').val());
    let heightIn = parseFloat($('#height').val());
    let depthIn = parseFloat($('#depth').val());

    let fullWidthIn = depthIn / 2 + widthIn * 2 + depthIn * 2;
    let fullHeightIn = depthIn + heightIn + depthIn + offset * 0.8 / scale * 2;

    console.log(`fullWidthIn: ${fullWidthIn} fullHeightIn ${fullHeightIn}`);

    width = widthIn * scale;
    height = heightIn * scale;
    depth = depthIn * scale;

    viewBoxWidth = (depth / 2 + width + depth + width + depth);
    viewBoxHeight = (depth + height + depth) * 1.3;// without 1.3 scale factor, the svg preview is getting cut off

    console.log(`generateBox with width ${width} height ${height} depth ${depth} viewBoxWidth ${viewBoxWidth} viewBoxHeight ${viewBoxHeight}`);
    return `<svg width="${fullWidthIn}in" height="${fullHeightIn}in" viewBox="0  0 ${viewBoxWidth + paddingAmt} ${viewBoxHeight + paddingAmt}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none"> 
    <g class="cuts" stroke="blue">
        <path class="cut" vector-effect="non-scaling-stroke" d="
M${depth / 2 + width / 10} ${depth / 2 - offset * 0.8}
l-${width / 10} ${offset * 0.8}
M${depth / 2} ${depth / 2}
v${depth} 
h-${depth / 2}
v${height} 
h${depth / 2} 
v${depth}
l${width / 10} ${offset * 0.8}
h${width - width / 10 * 2}
l${width / 10} -${offset * 0.8}
v-${depth} 
M${width + depth / 2} ${depth / 2 + depth + height + width / 2}
h${depth} 
v-${width / 2} 
h${width} 
v${width / 2} 
h${depth} 
v-${width / 2} 
v-${height} 
v-${width / 2} 
h-${depth} 
v${width / 2} 
h-${width} 
v-${width / 2} 
h-${depth} 
v${width / 2} 
M${depth / 2 + width} ${depth / 2 + depth - width / 2} 
v-${depth - width / 2}
l-${width / 10} -${offset * 0.8}
h-${width - width / 10 * 2} 
"/>
    </g>
    <g stroke="black" stroke-weight="1" class="score" stroke-dasharray="2">
      <path class="score" vector-effect="non-scaling-stroke" d="
M${depth / 2} ${depth / 2} h${width} 
M${depth / 2} ${depth / 2 + depth}h${width} 
M${depth / 2} ${depth / 2 + depth + height}h${width} 
M${depth / 2} ${depth / 2 + depth + height + depth}h${width} 
M${depth / 2} ${depth / 2 + depth}v${height} 
M${depth / 2 + width} ${depth / 2 + depth}v${height} 
M${depth / 2 + width} ${depth / 2 + depth}h${depth} 
M${depth / 2 + width} ${depth / 2 + depth + height}h${depth} 
M${depth / 2 + width + depth} ${depth / 2 + depth}v${height} M${depth / 2 + width + depth + width} ${depth / 2 + depth}v${height} 
M${depth / 2 + width + depth + width} ${depth / 2 + depth}h${depth} M${depth / 2 + width + depth + width} ${depth / 2 + depth + height}h${depth}
"/>
    </g>
  </svg>`;
}

function updateBox(newSVG = null) {
    if(newSVG === null) {
        newSVG = generateBox()
    }
    let $box = $('.box');
    $box.empty();
    $box.append(newSVG);
}

function addWindow(type) {
    let windowPath;
    width = parseFloat($('#width').val()) * scale;
    height = parseFloat($('#height').val()) * scale;
    depth = parseFloat($('#depth').val()) * scale;

    let ns = 'http://www.w3.org/2000/svg';

    if (type === "rect") {
        windowPath = document.createElementNS(ns, 'rect');
        windowPath.setAttribute('class', "window cut");
        windowPath.setAttribute("stroke-width", '1');
        windowPath.setAttribute("fill", "none");
        windowPath.setAttribute("x", `${depth / 2 + width + depth + offset}`);
        windowPath.setAttribute("y", `${depth / 2 + depth + offset}`);
        windowPath.setAttribute("width", `${width - offset * 2}`);
        windowPath.setAttribute("height", `${height - offset * 2}`);
        $('svg .cuts .window').remove();
        $('svg .cuts').append(windowPath);
    } else if (type === "ellipse") {
        windowPath = document.createElementNS(ns, 'ellipse');
        windowPath.setAttribute('class', 'window cut');
        windowPath.setAttribute("stroke-width", '1');
        windowPath.setAttribute("fill", "none");
        windowPath.setAttribute("cx", `${depth / 2 + width + depth + width / 2}`);
        windowPath.setAttribute("cy", `${depth / 2 + depth + height / 2}`);
        windowPath.setAttribute("rx", `${(width - offset * 2) / 2}`);
        windowPath.setAttribute("ry", `${(height - offset * 2) / 2}`);
        $('svg .cuts .window').remove();
        $('svg .cuts').append(windowPath);
    } else {
        $('svg .cuts .window').remove();
    }
    let newSVG = (new XMLSerializer).serializeToString($('.box svg')[0]);
    console.log(`newSVG: ${newSVG}`);
    updateBox(newSVG);
}

// setActive
// add active class to selected window type
function setActive(el) {
    let type = $(el).attr('id');
    $('.windowSelector button').removeClass('active');
    $(el).addClass('active');
    addWindow(type);
}

$('.generate').on('click', function () {
    updateBox();

    let activeWindowType = $('.windowSelector button.active').attr('id');
    console.log(`activeWindowType ${activeWindowType}`);
    if (activeWindowType !== "none") {
        console.log('generate window');
        addWindow(activeWindowType);
    }
});

$('.export').on('click', function () {
    let downloadLink = document.createElement('a');
    downloadLink.download = 'box.svg';
    downloadLink.href = "data:image/svg+xml," + (new XMLSerializer).serializeToString($('.box svg')[0]);
    console.log(downloadLink.href);
    downloadLink.click();
});

function parseSTL() {
    console.log('parseSTL');
    let stlFile = $('#stlFile');
    let file = stlFile[0].files[0];
    let fileName = file.name;
    console.log(`filename: ${fileName}`);
    let fileExt = fileName.substr(fileName.lastIndexOf('.') + 1).toLowerCase();
    console.log(`fileExt: ${fileExt}`);

    if (fileExt === "stl") {
        let formData = new FormData();
        formData.append('file', file);

        $.ajax({
            type: 'POST',
            url: '/parseSTL',
            data: formData,
            contentType: false,
            processData: false,
            async: false,
            cache: false,
            success: function (data) {
                console.log(data);
                // set width, height, and depth values
                $('#width').val(data[0]);
                $('#depth').val(data[1]);
                $('#height').val(data[2]);
                $('.generate').click();
            }
        });
    } else {
        window.alert('Please select a valid .stl file');
        stlFile.val('');
    }
}