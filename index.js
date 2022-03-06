require('dotenv').config();
const neo4j = require('neo4j-driver');

const uri = `neo4j://${process.env.NEO4J_HOST}:${process.env.NEO4J_PORT}`;
const driver = neo4j.driver(uri, neo4j.auth
    .basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD));
const session = driver.session();


async function addPessoa(obj1,obj2){
    try {
        const query = `CREATE (p1:Pessoa{nome:"${obj1.nome}"}),(p2:Pessoa{nome:"${obj2.nome}"}) RETURN p1,p2`;
        await session.run(query).then(result => console.log(result.records[0].length>0));
    } finally {
    await session.close()
    }
}

async function addAmizade(nome1, nome2){
    try{
        const query = `MATCH (p1:Pessoa),(p2:Pessoa)
            WHERE p1.nome = "${nome1}" AND p2.nome="${nome2}"
            CREATE (p1)-[:relacao {data: date.datetime()}] ->(p2)`;
        await session.run(query).then(result => console.log(
            result.summary.counters._stats.relationshipsCreated));
    }finally{
        await session.close();
    }
}


const obj1 = {
    nome: "Paulo Freitas",
}
const obj2 = {
    nome: "Wotson",
}

//addPessoa(obj1,obj2);

addAmizade("Paulo Freitas", "Wotson");