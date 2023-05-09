const networkGraph = {
    createGraph: function (nodes, links) {
        const width = 400
        const height = 400

        const fillColor = function (g) {
            return 'lightblue';
        }

        // Basic attraction, repulsion, and gravity settings
        // https://runebook.dev/ko/docs/d3/d3-force#many-body
        // https://github.com/d3/d3-force/blob/v3.0.0/README.md#forces

        const simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links).id(d => d.id))
            .force('charge', d3.forceManyBody().strength(5)) // Force between all nodes, if positive, pull, if negative, repel.
            .force('center', d3.forceCenter(width / 2, height / 2)) // center of gravity
            .force('collide', d3.forceCollide().radius(d => 35)) // Make the nodes non-overlapping, reducing them to overlap.

        const svg = d3.select('svg')
            .attr('width', width)
            .attr('height', height)

        const g = svg.append('g')

        const link = g.append('g')
            .attr('stroke', 'gray')
            .attr('stroke-opacity', '0.3') //Transparency of the line, set to normal transparent as lines often overlap
            .selectAll('line')
            .data(links)
            .join('line')
            .attr('distance', d => 10)
            .attr('stroke-width', d => 2 * d) // Set thickness proportional to distance

        const node = g.append('g')
            .selectAll('g')
            .data(nodes)
            .enter()
            .append('g')
            .each(function (d) {
                d3.select(this)
                    .append('circle')
                    .attr('r', 10)
                    .attr('fill', fillColor(null))

                d3.select(this)
                    .append('text')
                    .text(`${d.title}`)
                    .attr('dy', 0)
                    .style('text-anchor', 'middle')
            })
            .call(drag(simulation))


        simulation.on('tick', function () {
            link.attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y)

            node.attr("transform", d => `translate(${d.x},${d.y})`);
        })

        return svg.node()
    }
}

// https://observablehq.com/@d3/force-directed-lattice?collection=@d3/d3-drag
// https://github.com/d3/d3-drag/blob/v3.0.0/README.md#drag_on
function drag(simulation) {
    function start(event, d) { // event and d value are entered.
        if (!event.active) {
            simulation.alphaTarget(0.1).restart()
        } ///simulation restart
        // alphaTarget has a value between 0 and 1. You can think of it as the animation that starts at the beginning.
        d.fx = d.x;
        d.fy = d.y;

        d3.select("#node_title").property("value", d.title);
        d3.select("#node_desc").html(d.note);

        d3.select(this)
            .select('circle')
            .attr('stroke', 'white')
            .attr('stroke-width', '2px')
    }

    function drag(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function end(event, d) {
        if (!event.active) {
            simulation.alphaTarget(0)
        }
        d.fx = null;
        d.fy = null;

        d3.select(this)
            .select('circle')
            .attr('stroke', 'null')
            .attr('stroke-width', 'null')
    }

    return d3.drag()
        .on('start', start)
        .on('drag', drag)
        .on('end', end)

}


// Set Title
browser.tabs.query({active: true, currentWindow: true}).then(tabs => {
    for (const tab of tabs) {
        d3.select("#title").property("value", tab.title);
    }
});

// Set Description
function get_desc(prop) {
    var desc = "";
    browser.tabs.executeScript({
        code: "document.querySelector('" + prop + "').content"
    }).then(results => {
        desc = results[0];
        if (desc !== "" && desc != undefined) {
            d3.select("#description").text(desc);
        }
        return true;
    }).catch(err => {
        //console.log("ERROR: Exception occurred while getting description for: " + prop, err);
    });
    return false;
}

let props = [
    "meta[name=\"twitter:description\"]",
    "meta[name=\"description\"]",
    "meta[property=\"description\"]"
]

for (let prop in props) {
    let flag = get_desc(props[prop]);
    if (flag) {
        break;
    }
}

// Set Selection
browser.tabs.executeScript({
    code: "document.getSelection().toString()"
}).then(results => {
    d3.select("#selection").text(results[0])
});


// On Click Listener for Draw Graph
document.getElementById("draw_graph").addEventListener("click", drawGraph);

function drawGraph() {
    document.getElementById("graph_space").innerHTML = "";

    let title_text = document.querySelector("#title").value; //d3.select("#title").text() + "ash";
    let desc_text = d3.select("#description").property("value");
    let selection_text = d3.select("#selection").property("value");
    let no_of_results = document.querySelector("#results").value;
    browser.runtime.sendMessage({
        title: title_text,
        desc: desc_text,
        selection: selection_text,
        results: no_of_results,
        time: Date.now()
    }).then(data => {
        let json = JSON.parse(data['data']);
        networkGraph.createGraph(JSON.parse(json.nodes), JSON.parse(json.links));
    }).catch(err => {
        console.log("ERROR: Exception occurred while creating the popup.", err)
    });
}

// Draw Graph with Default Selections
setTimeout(function () {
    drawGraph();
}, 100);



