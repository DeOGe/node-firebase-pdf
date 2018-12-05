
// import _ from 'lodash';
// import Moment from 'moment';
import Mysql from '../../database/Mysql';

class Appointment {

    constructor() {
        this.db = Mysql;
        this.table = 'appointments';
    }

    all() {
        return this.db
            .table(this.table);
    }

    // searchPaid(txn, refno) {
    //     // console.log(refno, 'argel2');
    //     return this.db
    //         .table(this.table)
    //         .where('ref_no', txn)
    //         .where('payment_gateway_ref_no', refno)
    //         .where('status', 'PAID');
    // }

    searchPaid(txn, refno) {
        return this.db
            .select('*', 'appointments.id')
            .from(this.table)
            .innerJoin('appointment_applicants', `${this.table}.id`, 'appointment_applicants.appointment_id')
            .innerJoin('appointment_schedules', 'appointments.schedule_id', 'appointment_schedules.id')
            .innerJoin('branches', 'appointment_schedules.branch_id', 'branches.id')
            .where(`${this.table}.ref_no`, txn)
            .where(`${this.table}.payment_gateway_ref_no`, refno)
            .where(`${this.table}.status`, 'PAID');
    }
}

export default new Appointment();
