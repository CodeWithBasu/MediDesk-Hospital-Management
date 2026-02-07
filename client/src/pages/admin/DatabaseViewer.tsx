import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import axios from 'axios';
import { Database, Table, RefreshCw } from 'lucide-react';

const DatabaseViewer: React.FC = () => {
    const [tables, setTables] = useState<string[]>([]);
    const [selectedTable, setSelectedTable] = useState<string | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [tableData, setTableData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchTables = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/tables');
            setTables(response.data);
            if (response.data.length > 0 && !selectedTable) {
                setSelectedTable(response.data[0]);
            }
        } catch (error) {
            console.error("Error fetching tables:", error);
        }
    };

    const fetchTableData = async (tableName: string) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/admin/tables/${tableName}`);
            setTableData(response.data);
        } catch (error) {
            console.error(`Error fetching data for ${tableName}:`, error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTables();
    }, []); // Empty dependency array is correct for initial mount fetch

    useEffect(() => {
        if (selectedTable) {
            fetchTableData(selectedTable);
        }
    }, [selectedTable]);

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] space-y-6">
            <div className="flex items-center justify-between">
                <div>
                   <h1 className="text-2xl font-bold text-gray-900">Database Viewer</h1>
                   <p className="text-sm text-gray-500 mt-1">Directly inspect your database content</p>
                </div>
                <Button variant="outline" onClick={() => { fetchTables(); if(selectedTable) fetchTableData(selectedTable); }}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                </Button>
            </div>

            <div className="flex flex-1 gap-6 overflow-hidden">
                {/* Sidebar */}
                <div className="w-64 bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-gray-100 bg-gray-50 font-medium text-gray-700 flex items-center">
                        <Database className="w-4 h-4 mr-2" />
                        Tables
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {tables.map(table => (
                            <button
                                key={table}
                                onClick={() => setSelectedTable(table)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center ${
                                    selectedTable === table 
                                        ? 'bg-blue-50 text-blue-700 font-medium' 
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <Table className="w-4 h-4 mr-2 opacity-70" />
                                {table}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col">
                     <div className="p-4 border-b border-gray-100 bg-gray-50 font-medium text-gray-900 flex justify-between items-center">
                        <span>{selectedTable ? `Table: ${selectedTable}` : 'Select a table'}</span>
                        <span className="text-xs text-gray-500">{tableData.length} records</span>
                    </div>
                    
                    <div className="flex-1 overflow-auto">
                        {loading ? (
                            <div className="flex items-center justify-center h-full text-gray-500">Loading data...</div>
                        ) : tableData.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-gray-400">No records found</div>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {Object.keys(tableData[0]).map((key) => (
                                            <th key={key} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                                {key}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {tableData.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            {Object.values(row).map((val: any, i) => (
                                                <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {typeof val === 'object' && val !== null ? JSON.stringify(val) : String(val)}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DatabaseViewer;
