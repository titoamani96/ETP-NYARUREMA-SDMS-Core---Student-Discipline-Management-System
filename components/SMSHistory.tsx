
import React from 'react';
import { SMSLog } from '../types';
import { MessageSquare, Calendar, Phone, User, CheckCircle2, ShieldAlert } from 'lucide-react';

interface SMSHistoryProps {
  logs: SMSLog[];
}

const SMSHistory: React.FC<SMSHistoryProps> = ({ logs }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-xl font-bold text-slate-800 flex items-center">
              <MessageSquare size={24} className="mr-3 text-blue-600" />
              Communication Audit Trail
            </h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Gateway Logs for Parental Notifications</p>
          </div>
          <div className="hidden sm:flex items-center space-x-2 bg-white px-4 py-2 rounded-full border border-slate-200 text-[10px] font-black">
            <span className="text-emerald-500">GATEWAY STATUS:</span>
            <span className="text-slate-600">CONNECTED</span>
          </div>
        </div>

        <div className="divide-y divide-slate-50">
          {logs.length > 0 ? (
            [...logs].reverse().map((log) => (
              <div key={log.id} className="p-8 hover:bg-slate-50/50 transition-colors group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center text-sm font-bold text-slate-900">
                        <User size={16} className="mr-2 text-slate-300 group-hover:text-blue-500 transition-colors" />
                        {log.recipientName}
                      </div>
                      <div className="flex items-center text-xs text-slate-500 font-bold bg-slate-100 px-2 py-1 rounded-lg">
                        <Phone size={14} className="mr-1.5" />
                        {log.phoneNumber}
                      </div>
                      <div className="flex items-center text-[10px] text-slate-400 font-black uppercase tracking-widest">
                        <Calendar size={14} className="mr-1.5" />
                        {log.timestamp}
                      </div>
                    </div>
                    <div className="bg-white border border-slate-100 p-5 rounded-2xl text-sm text-slate-600 shadow-sm leading-relaxed border-l-4 border-l-blue-600/20 italic">
                      "{log.message}"
                    </div>
                  </div>
                  <div className="shrink-0">
                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-widest ${
                      log.status === 'Sent' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
                    }`}>
                      {log.status === 'Sent' ? <CheckCircle2 size={12} className="mr-2" /> : <ShieldAlert size={12} className="mr-2" />}
                      {log.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-24 text-center text-slate-400">
              <div className="inline-flex p-6 rounded-3xl bg-slate-50 mb-6">
                <MessageSquare size={64} className="opacity-10" />
              </div>
              <p className="text-xl font-black text-slate-800">No Transmission Data</p>
              <p className="text-sm text-slate-400 font-medium max-w-xs mx-auto mt-2">Disciplinary reports with parent alerts will be logged here automatically.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SMSHistory;
