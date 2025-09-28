class Task {
    constructor(id, data) {
        this.id = id;
        Object.assign(this, data);
    }
}

export default Task;