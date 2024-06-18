import LinkedList from "./LinkendList.mjs";

export default class Graph {
    #matrizAdyacencia = [];
    #map = new Map();

    constructor() { }

    addV(value) {
        this.#matrizAdyacencia.push(new LinkedList());
        this.#map.set(value, this.#matrizAdyacencia.length - 1);
    }

    addConexion(start, end, weight = 1) {
        if (this.#map.has(start) && this.#map.has(end)) {
            this.#matrizAdyacencia[this.#map.get(start)].push(end, weight);
            return true;
        }
        return false;
    }

    bfs(callback) {
        let queue = []
        let list = []
        const entries = [...structuredClone(this.#map)];
        for (let i = 0; i < this.#matrizAdyacencia.length; i++)
            list[i] = false

        let [key] = entries[0]
        queue.push(key)

        while (queue.length > 0) {
            let val = queue.shift()
            callback(val)
            list[this.#map.get(val)] = true
            for (let i = 0; i < this.#matrizAdyacencia[this.#map.get(val)].length; i++) {
                if (this.#matrizAdyacencia[this.#map.get(val)][i]) {
                    let [key] = entries[i]
                    if (!list[this.#map.get(key)] && !queue.includes(key))
                        queue.push(key)
                }
            }
        }
    }
    
    
    dfs(callback) {
        let stack = [];
        let list = [];
        // Hacemos una copia estructurada del mapa de adyacencias para evitar modificar el original
        const entries = [...structuredClone(this.#map)];
        
        // Inicializamos la lista para hacer seguimiento de los nodos visitados
        for (let i = 0; i < this.#matrizAdyacencia.length; i++)
            list[i] = false;
    
        // Tomamos la clave del primer nodo de la estructura de entrada
        let [key] = entries[0];
        // Agregamos el primer nodo a la pila
        stack.push(key);
        // Comenzamos el bucle que se ejecuta mientras haya elementos en la pila
        while (stack.length > 0) {
            let val = stack.pop();  // Sacamos el último elemento de la pila agreado 
            if (!list[this.#map.get(val)]) {
                callback(val);//pasamos el valor del nodo actual
                list[this.#map.get(val)] = true;// Marcamos el nodo como visitado para no volver a agregarlo a la pila
                let neighbors = [...this.#matrizAdyacencia[this.#map.get(val)].iterator()];// Obtenemos los vecinos del nodo actual
                for (let i = neighbors.length -1; i >= 0; i--) {
                    let neighbor = neighbors[i];
                    // Si el vecino no ha sido visitado, lo agregamos a la pila
                    if (!list[this.#map.get(neighbor.name)])
                        stack.push(neighbor.name);
                }
            }
        }
    }
    //metodo para explorar rutas
    dijkstra(start) {
        let distances = {};
        let anterior = {};
        const queue = new Set(this.#map.keys());
        for (let vertex of this.#map.keys()) {
            distances[vertex] = 1000000;
            anterior[vertex] = null;
        }

        distances[start] = 0;
        while (queue.size > 0) {
            let minNode = null;
            for (let vertice of queue) {
                if (minNode === null || distances[vertice] < distances[minNode]) {
                    minNode = vertice;
                }
            }
            queue.delete(minNode);
            let neighbors = [...this.#matrizAdyacencia[this.#map.get(minNode)].iterator()];
            for (let neighbor of neighbors) {
                //comparo dos caminos y dependiendo cual sea el peso menor, sera el que se guardara/
                let caminoSecundario = distances[minNode] + neighbor.distance;
                if (caminoSecundario < distances[neighbor.name]) {
                    distances[neighbor.name] = caminoSecundario;
                    anterior[neighbor.name] = minNode;
                }
            }
        }

        return { distances, anterior };
    }
    //recibe a dijkstra para mostrar las rutas mas cortas
    rutasCortas(start) {
        const { distances, anterior } = this.dijkstra(start);
        let camino = {};

        for (let end of this.#map.keys()) {
            const path = [];
            let current = end;

            while (current !== null) {
                path.unshift(current);
                current = anterior[current];
            }

            if (path[0] === start) {
                camino[end] = path;
            } else {
                camino[end] = [];
            }
        }

        return { distances, camino };
    }



}


