export const store = {
  courses: [] as any[],
  assignments: [] as any[],
  students: [] as any[],
  enrollments: [] as any[],
  formulas: [] as any[],
  submissions: [] as any[],
  _id: 1,
  nextId() {
    return this._id++;
  },
  getAssignmentById(id: number) {
    return this.assignments.find((a) => a.id === id);
  },
};

export default store;
