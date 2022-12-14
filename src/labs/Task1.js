import '../App.css'
import React, {useEffect, useState, useRef} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faPen, faFile, faWindowMinimize } from '@fortawesome/free-solid-svg-icons'
import { Graph, VisGraph } from '../components/Graph';
import { create, all } from 'mathjs'
import Draggable from 'react-draggable'
import ForceGraph2D from 'react-force-graph-2d';
import { createNextMatrix, findNextNodes, findNodeDegree } from '../components/Math';

const Task1 = () => {

    const config = { }
    const math = create(all, config)
    const forceRef = useRef(null)

    const [backendData, setBackendData] = useState([{}])

    const [widgetList, setWidgetList] = useState([

    ])

    const [showFWindow, setShowFWindow] = useState([{}])
    const [showSWindow, setShowSWindow] = useState([{}])

    const [V, setV] = useState()
    const [R, setR] = useState()
    const [N, setN] = useState([])
    
    // - Массив смежных вершин
    const [nextNodes, setNextNodes] = useState([])

    // - Матрица смежности
    const [nextMatrix, setNextMatrix] = useState([])
    
    // - Степени вершин
    const [degrees, setDegrees] = useState([])

    const [graph, setGraph] = useState([])

    const showFrist = (index) => {
        const list = [...widgetList]
        list.pop()
        list.push({widget: "first"})
        setWidgetList(list)
    }
    
    const showSecond = (index) => {
        const list = [...widgetList]
        list.pop()
        list.push({widget: "second"})
        setWidgetList(list)
    }
    
    const showThird = (index) => {
        const list = [...widgetList]
        list.pop()
        list.push({widget: "third"})
        setWidgetList(list)    
    }

    const showWindow = (index, signal) => {
        switch (index) {
            case 0:
                var list = [...showFWindow]
                list.pop()
                if(signal) list.push({state: 'show'})
                else list.push({state: 'hide'})
                setShowFWindow(list)
                break;
            case 1:
                var list = [...showSWindow]
                list.pop()
                if(signal) list.push({state: 'show'})
                else list.push({state: 'hide'})
                setShowSWindow(list)
                break;
        }

    }

    useEffect(() => {        
        var G = new Graph(3, 2)
        console.log('graph genering', G)
        setGraph(G)
        console.log('graph generated', graph.nodes)

        const stateList = [{ state: 'hide' }]
        setShowFWindow(stateList)
        setShowSWindow(stateList)
    }, [])

    function handleSubmit() {
        if( V > 0 && R >= V-1 && R <= (V * (V - 1) / 2)) {
            console.log('IN V', V, 'IN R', R)
            var G = new Graph(V, R)
            console.log('graph genering', G)
            setGraph(G)
            console.log('graph generated', graph.nodes)

            let N = Array.from({ length: V }, (v, i) =>  i + 1)
            setN(N)

            let list = []
            list = findNextNodes(G.nodes, G.vertices)
            setNextNodes(list)
            console.log('   NEXT NODES', nextNodes)

            let matrix = []
            matrix = createNextMatrix(G.nodes, G.vertices)
            setNextMatrix(matrix)

            let degrees = []
            degrees = findNodeDegree(matrix)
            setDegrees(degrees)
        }
    }

    return(
        <div class='container'>
            <div class="sidebar">
                <div class="profile">
                            <label>Количество вершин</label>
                            <input type='number' onChange={(e) => setV(parseInt(e.target.value))}/>
                            <div></div>
                            <label>Количество рёбер</label>
                            <input type='number' onChange={(e) => setR(parseInt(e.target.value))}/>
                            <button onClick={handleSubmit}>Применить</button>
                </div>

                <div class="menu">
                <button onClick={() => showFrist(0)}>
                    <FontAwesomeIcon icon={faPen} size='sm'></FontAwesomeIcon>
                    <a>Список рёбер</a>
                </button>
                <button onClick={() => showSecond(1)}>
                    <FontAwesomeIcon icon={faPen} size='sm'></FontAwesomeIcon>
                    <a>Список смежных вершин</a>
                </button>
                <button onClick={() => showThird(2)}>
                    <FontAwesomeIcon icon={faPen} size='sm'></FontAwesomeIcon>
                    <a>Матрица инцидентности</a>
                </button>
                </div>
                
                <div class='wrapper'>
                    <div class='match-result'>
                        <p>Сгенерировать связный граф, представив его как список рёбер, затем: </p>
                        <p>1. Преобразовать в список смежных вершин </p>
                        <p>2. Преобразовать в матрицу инцидентности.</p>
                        <p>Вычисляются степени вершин.</p>  
                    </div>
                </div>

                {console.log(widgetList)}
                {console.log(backendData)}

                <div class="footer">
                V1.0 25.08.2022
                </div>
                
            </div>

            { showFWindow.map((object, index) => (
                <div>
                { object.state === 'show' && 
                <Draggable defaultClassName='canvas' handle='#handle'>
                <div class='canvas' id='canv' key={index}>
                    <div class='handle' id='handle'>
                        <button onClick={() => showWindow(0, 0)}><FontAwesomeIcon icon={faWindowMinimize} size='sm'></FontAwesomeIcon></button>
                        <a>Представление</a>
                    </div>
                    { widgetList.map((item, index) => (
                        <div>
                            <div style={{ 
                                textAlign: 'center',
                                marginTop: '10px'
                             }}>
                            <a>Степени вершин</a>
                            { N.map((item, i) => (
                                <div key={i} style={{
                                    display: 'inline-block',
                                    marginLeft: '10px',
                                }}>
                                    <div> {item}: { degrees[item-1] }</div>
                                </div>
                            )) }   
                            </div>                      
                            { item.widget === 'first' && 
                                <div style={{ textAlign: 'center', marginTop: '15px'}}>
                                    <a>Список рёбер</a>
                                    <div class='scheme'> 
                                        { graph.nodes.map((pair, index) => (
                                            <div class='rowN' key={index}>
                                                <div class='el'>{pair[0]}</div>
                                                <div class='el'>{pair[1]}</div>
                                            </div>                                        
                                        )) }
                                    </div>
                                </div>
                            }
                            { item.widget === 'second' &&
                                <div style={{ textAlign: 'center', marginTop: '15px'}}>
                                    <a>Список смежных вершин</a>
                                    <div class='scheme'> 
                                        { N.map((item, index) => (
                                            <div class='rowN' key={index}>
                                                <div class='el'>{item}</div>
                                                    <div class='rowP'>
                                                        <div class='el'>{ nextNodes[item-1] }</div>
                                                    </div>
                                            </div>                                        
                                        )) }
                                    </div>
                                </div> 
                            }
                            { item.widget === 'third' &&
                                <div style={{ textAlign: 'center', marginTop: '15px'}}>
                                    <a>Матрица инцидентности</a>
                                    <div class='scheme'>
                                        { graph.nodes.map((obj, i) => (
                                            <div class='rowN' key={i}>
                                                <div class='el'>{obj}</div>
                                            </div>
                                        )) } 
                                        { nextMatrix.map((item, index) => (
                                            <div class='rowN' key={index} style={ { display: 'block', padding: '15px' } }>
                                                { item.map((obj, i) => (
                                                    <div class='el' key={i} style={{ 
                                                        display: 'inline-block'
                                                     }}>{JSON.stringify(obj)}</div>
                                                )) }
                                                    {/* <div class='rowP'>
                                                        <div class='el'>{ nextNodes[item-1] }</div>
                                                    </div> */}
                                            </div>                                        
                                        )) }
                                    </div>
                                </div> 
                            }   
                        </div>
                    )) }
                    {/* {N.length > 0 &&
                    <div class='tables'>
                        <div class='scheme'>
                            {N.map((i, index) => (
                                <div class='rowN' key={index}>
                                    <div class='el'>{i}</div>
                                </div>
                            ))}
                            <br></br>            
                            {scheme.map((i, index) => (
                                <div>
                                {i.map((item, k) => (
                                    <div class='rowP' key={k}>
                                        <div class='el'>{math.round(item, 6)}</div>
                                    </div>
                                ))}
                                </div>                                        
                            ))}
                        </div>  
                        <div class='tableH'>
                        {H.map((i, index) => (
                                <div class='rowP' key={index}>
                                        <div class='el'>{math.round(i, 6)}</div>
                                </div>                                       
                            ))}  
                        </div>
                    </div>}  */}
                </div>
                </Draggable> }
                </div>
            ))}

            { showSWindow.map((object, index) => (
                <div>
                { object.state === 'show' && 
                <Draggable defaultClassName='canvas-graph' handle='#handle' ref={forceRef}>
                    <div class='canvas-graph' key={index}>
                        <div class='handle' id='handle'>
                            <button onClick={() => showWindow(1, 0)}><FontAwesomeIcon icon={faWindowMinimize} size='sm'></FontAwesomeIcon></button>
                            <a>Граф</a>
                        </div>              
                        <div class='graph-wrapper' id='graph'>
                            <VisGraph graph={graph} isOriented={false}/>
                            {/* <React.Fragment>
                                <Graph/>   
                            </React.Fragment> */}
                            {  }
                        </div>   
                        </div> 
                </Draggable> 
                }
                </div>
            ))}

            <div class='panel'>
                <button onClick={() => showWindow(0, 1)}><FontAwesomeIcon icon={faFile} size='lg'></FontAwesomeIcon></button>
                <button onClick={() => showWindow(1, 1)}><FontAwesomeIcon icon={faFile} size='lg'></FontAwesomeIcon></button>
            </div>
        </div>
    )
}

export default Task1
