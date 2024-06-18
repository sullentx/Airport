import Graph from "../models/Graph.mjs";

const graph = new Graph();

const addVertexBtn = document.getElementById('addVertexBtn');
const addEdgeBtn = document.getElementById('addEdgeBtn');
const shortestPathBtn = document.getElementById('shortestPathBtn');
const resultContainer = document.getElementById('resultContainer');

// Evento para agregar un aeropuerto
addVertexBtn.addEventListener("click", (event) => {
    event.preventDefault();
    const vertexName = document.getElementById('vertexName').value.trim();
    if (vertexName !== '') {
        graph.addV(vertexName);
        showAlert('success', `Se ha agregado la ciudad: ${vertexName}`);
        document.getElementById('vertexName').value = '';
    } else {
        showAlert('error', 'Ingrese un nombre válido para la ciudad.');
    }
});

// Evento para agregar una conexión 
addEdgeBtn.addEventListener("click", (event) => {
    event.preventDefault();
    const startVertex = document.getElementById('startVertex').value.trim();
    const endVertex = document.getElementById('endVertex').value.trim();
    const weight = document.getElementById('weight').value.trim();

    if (startVertex !== '' && endVertex !== '' && weight !== '' && !isNaN(weight)) {
        const added = graph.addConexion(startVertex, endVertex, parseFloat(weight));
        if (added) {
            showAlert('success', `Se ha agregado la ruta de ${startVertex} a ${endVertex} con distancia ${weight} km.`);
            document.getElementById('startVertex').value = '';
            document.getElementById('endVertex').value = '';
            document.getElementById('weight').value = '';
        } else {
            showAlert('error', 'No se pudo agregar la ruta. Verifique las ciudades ingresadas.');
        }
    } else {
        showAlert('error', 'Ingrese valores válidos para las ciudades y la distancia.');
    }
});
//mostar dfs

dfsBtn.addEventListener("click", () => {
    const visitedNodes = [];

    graph.dfs((vertex) => {
        visitedNodes.push(vertex);
        showAlert('info', `Visitando vértice: ${vertex}`);
    });

    showVisitedNodes(visitedNodes);
});
//ruta mas corta
shortestPathBtn.addEventListener("click", (event) => {
    event.preventDefault();
    const startVertex = document.getElementById('startVertexPath').value.trim();

    if (startVertex !== '') {
        const { distances } = graph.rutasCortas(startVertex);

        let distancesList = '';
        Object.keys(distances).forEach(vertex => {
            distancesList += `<li>Distancia a ${vertex}: ${distances[vertex]} km</li>`;
        });

        resultContainer.innerHTML = `<ul>${distancesList}</ul>`;
        showAlert('success', 'Distancias calculadas correctamente.');
    } else {
        showAlert('error', 'Ingrese un aeropuerto inicial válido.');
    }
});

//funciones para mostrar datos
function showAlert(type, message) {
    Swal.fire({
        icon: type,
        text: message,
    });
}

// Función para mostrar la lista de nodos visitados
function showVisitedNodes(visitedNodes) {
    let nodesList = '';
    visitedNodes.forEach(node => {
        nodesList += `<li>${node}</li>`;
    });

    Swal.fire({
        icon: 'success',
        title: 'Nodos Visitados',
        html: `<ul>${nodesList}</ul>`,
    });
}
