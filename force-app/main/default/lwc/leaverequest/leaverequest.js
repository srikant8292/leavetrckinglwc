import { LightningElement ,wire } from 'lwc';
import getLeaveRequests from '@salesforce/apex/LeaveRequstController.getLeaveRequests'
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import id from '@salesforce/user/Id'
const colums=[
    {label : "Request Id" ,fieldName : "Name",cellAttributes: { class: { fieldName: 'cellClass' } }},
    {label : "From Date" ,fieldName : "From_Date__c" ,cellAttributes: { class: { fieldName: 'cellClass' } }},
    {label : "To Date" ,fieldName : "To_Date__c",cellAttributes: { class: { fieldName: 'cellClass' } }},
    {label : "Reason" ,fieldName : "Reason__c",cellAttributes: { class: { fieldName: 'cellClass' } }},
    {label : "Status" ,fieldName : "Status__c",cellAttributes: { class: { fieldName: 'cellClass' } }},
    {label : "Manager Comment" ,fieldName : "Manager_Comment__c",cellAttributes: { class: { fieldName: 'cellClass' } }},
    {type :"button",typeAttributes:{
        label:"Edit",
        name: "Edit",
        value :"Edit",
        title :"Edit",
        disabled : {fieldName : 'isEditDisabled'}
    }, cellAttributes: { class: { fieldName: 'cellClass' } }}
]
export default class Leaverequest extends LightningElement {


    myleavecolumns=colums;
    showModalPopup=false;

    currentloginuserid=id;

    objectApiName='LeaveRequest__c';
    recordId='';

    myleaveresult=[];
    wiremyleave;
    @wire(getLeaveRequests)
     wireMyLeaveResult(result){
        this.wiremyleave=result;

        if(result.data){
            this.myleaveresult=result.data.map(a => ({
                ...a,
                cellClass: a.Status__c == 'Approved' ? 'slds-theme_success' : a.Status__c == 'Rejected' ? 'slds-theme_warning' : '',
                isEditDisabled: a.Status__c != 'Pending'
            }));
        }
        if(result.error){
            console.log('error occur in my leave '+result.error);
        }
     }

     get noMyleaveRecord(){
        return this.myleaveresult.length == 0; 
     }
     popupCloseHandler(){
        this.showModalPopup=false;
     }

     successHandler(){
        this.showModalPopup=false;
        this.showToast('Data Saved Succesfully.......')
        refreshApex(this.myleaveresult);

     }

     showToast(message, title = 'success', variant = 'success') {
        const event = new ShowToastEvent({
            title,
            message,
            variant
        });
        this.dispatchEvent(event);
    }

    rowactionHandler(event){
        this.showModalPopup=true;
        this.recordId=event.detail.row.Id;
    }

    newRequestClickHandler(){
        this.showModalPopup=true;
        this.recordId='';
    }

    // submitHandler(event){
    //     event.preventDefault();
    //     const fields = { ...event.detail.fields };
    //     fields.Status__c = 'Pending';
    //     if (new Date(fields.From_Date__c) > new Date(fields.To_Date__c)) {
    //         this.showToast('From date should not be grater then to date', 'Error', 'error');
    //     }
    //     else if (new Date() > new Date(fields.From_Date__c)) {
    //         this.showToast('From date should not be less then Today', 'Error', 'error');
    //     }
    //     else {
    //         this.refs.leaveReqeustFrom.submit(fields);
    //     }
    // }
}