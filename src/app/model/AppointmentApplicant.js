// import _ from 'lodash';
// import Knex from 'knex';
// import Moment from 'moment';
import Mysql from '../../database/Mysql';

class AppointmentApplicant {

    constructor() {
        this.db = Mysql;
        this.table = 'appointment_applicants';
    }

    all = () => this.db
        .table(this.table)
        .where('is_live', 1);

    /* findAppointment = appointmentId => this.db
        .table(this.table)
        .where('appointment_id', appointmentId)
        .first(); */

    findAppointment = appointmentId => this.db
        .select('appointments.*')
        .from(this.table)
        .innerJoin('appointments', `${this.table}.appointment_id`, 'appointments.id')
        .innerJoin('appointment_schedules', 'appointments.schedule_id', 'appointment_schedules.id')
        .innerJoin('branches', 'appointment_schedules.branch_id', 'branches.id')
        .where(`${this.table}.appointment_id`, appointmentId)
        .first();
}

export default new AppointmentApplicant();
