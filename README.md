
# Distributed Key-Value Store API

A robust back-end API designed for a distributed, replicated, fault-tolerant, causally consistent, and sharded key-value store.

## Features 🌟
- **Distributed & Sharded Architecture**: Efficiently spreads keys across multiple shards to ensure even distribution using a modular hash function.
- **Replication**: Each shard contains at least two replicas, guaranteeing fault tolerance.
- **Causal Consistency**: Employs vector clocks to ensure causally consistent writes from clients and other nodes.
- **Broadcast Algorithms**: Seamlessly replicate key values across nodes on the same shard.

## Prerequisites 📝
Ensure Docker is installed on your machine, as the system operates on Docker containers.

## Getting Started 🚀
Dive into the project directory and familiarize yourself with the modularized functions. To get a hands-on experience, construct a key-value store comprising shards of nodes.

### Sample Cluster Setup:
- **Shard 1**: Alice, Bob, Carol
- **Shard 2**: Dave, Erin, Frank

Nodes will utilize subnet addresses ranging from 10.10.0.2 to 10.10.0.7, with all nodes listening on container port 8090. Additionally, their container port 8090 is published on host ports ranging from 8082 to 8087. 

On initialization, each node receives the following environment variables:
- `SOCKET_ADDRESS`: Describes the current node in "IP:PORT" format.
- `VIEW`: A comma-delimited string detailing the socket addresses of all active nodes.
- `SHARD_COUNT`: Dictates the number of shards to divide the nodes (and keys) into.

### Initial Setup:
1. **Build Your Container Image**:
```bash
$ docker build -t asg4img .
```
2. **Create A Subnet:**
```bash
$ docker network create --subnet=10.10.0.0/16 asg4net
```
3. **Run Nodes In The Network:**
```bash
# Alice Node
$ docker run --rm -p 8082:8090 --net=asg4net --ip=10.10.0.2 --name=alice -e SHARD_COUNT=2 -e SOCKET_ADDRESS=10.10.0.2:8090 -e VIEW=10.10.0.2:8090,10.10.0.3:8090,...,10.10.0.7:8090 asg4img
# Bob Node
$ docker run ... (followed by relevant details)
# Continue for Carol, Dave, Erin, and Frank using the pattern above.
```
Note: Adjust the IP, name, and port details accordingly for each node.

## Contribute 🤝
Contributions, issues, and feature requests are welcome. Feel free to check the issues page if you want to contribute.

## Support 🛠️
If you run into any problems or need assistance, please raise an issue or contact the maintainers.

