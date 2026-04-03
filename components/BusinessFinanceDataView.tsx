import React, { useState, useMemo } from 'react';
import { StyledInput, StyledButton, StyledSelect } from './UI';
import { SearchIcon, DownloadIcon, XIcon, RefreshCwIcon, ZoomInIcon, SidebarOpenIcon, SidebarCloseIcon, BarChartIcon, TrendingUpIcon, BellIcon, SettingsIcon } from './Icons';
import { Pagination } from './Pagination';
import { INNER_MONGOLIA_CITIES } from '../constants';

interface SummaryData {
    month: string;
    totalCost: number;
}

interface BusinessFinanceRecord {
    id: string;
    month: string;
    city: string;
    cat1: string;
    cat2: string;
    cat3: string;
    volume: number;
    unitPrice: number;
    totalCost: number;
}

interface DetailRecord {
    id: string;
    ticketNo: string;
    subject: string;
    productInstanceId: string;
    customerName: string;
    customerCode: string;
    cat1: string;
    cat2: string;
    cat3: string;
    terminalModel: string;
    deviceSn: string;
    city: string;
    address: string;
    type: '装机' | '移机';
    completionTime: string;
}

interface MaintenanceRecord {
    id: string;
    month: string;
    city: string;
    cat1: string;
    cat2: string;
    cat3: string;
    volume: number;
    unitPrice: number;
    totalCost: number;
}

interface MaintenanceDetailRecord {
    id: string;
    productInstanceId: string;
    customerName: string;
    customerCode: string;
    cat1: string;
    cat2: string;
    cat3: string;
    terminalModel: string;
    deviceSn: string;
    macAddress: string;
    city: string;
    address: string;
}

const MOCK_MAINTENANCE_LIST: MaintenanceRecord[] = [
    { id: 'm1', month: '2026-03', city: '呼和浩特市', cat1: '千里眼', cat2: '室内无线WIFI', cat3: '标准版', volume: 500, unitPrice: 10, totalCost: 5000 },
    { id: 'm2', month: '2026-03', city: '包头市', cat1: '千里眼', cat2: '室内外有线', cat3: '专业版', volume: 300, unitPrice: 15, totalCost: 4500 },
];

const MOCK_MAINTENANCE_DETAILS: MaintenanceDetailRecord[] = [
    {
        id: 'md1',
        productInstanceId: 'QLY-HHHT-001',
        customerName: '呼和浩特市家家悦超市',
        customerCode: 'CUST001',
        cat1: '千里眼',
        cat2: '室内无线WIFI',
        cat3: '标准版',
        terminalModel: 'IPC-V30-W',
        deviceSn: 'SN20260301001',
        macAddress: '00:1A:2B:3C:4D:5E',
        city: '呼和浩特市',
        address: '呼和浩特市赛罕区新华东街18号'
    }
];

const MOCK_SUMMARY: SummaryData = {
    month: '2026-03',
    totalCost: 1258400.50
};

const MOCK_LIST: BusinessFinanceRecord[] = [
    { id: '1', month: '2026-03', city: '呼和浩特市', cat1: '千里眼', cat2: '室内无线WIFI', cat3: '标准版', volume: 120, unitPrice: 150, totalCost: 18000 },
    { id: '2', month: '2026-03', city: '包头市', cat1: '千里眼', cat2: '室内外有线', cat3: '专业版', volume: 85, unitPrice: 280, totalCost: 23800 },
    { id: '3', month: '2026-03', city: '鄂尔多斯市', cat1: '千里眼', cat2: '室内无线WIFI', cat3: '标准版', volume: 150, unitPrice: 150, totalCost: 22500 },
    { id: '4', month: '2026-03', city: '赤峰市', cat1: '千里眼', cat2: '室内外有线', cat3: '企业版', volume: 60, unitPrice: 350, totalCost: 21000 },
    { id: '5', month: '2026-03', city: '通辽市', cat1: '千里眼', cat2: '室内无线WIFI', cat3: '标准版', volume: 95, unitPrice: 150, totalCost: 14250 },
];

const MOCK_DETAILS: DetailRecord[] = [
    {
        id: 'd1',
        ticketNo: 'GZ202603010001',
        subject: '呼和浩特某商超千里眼安装',
        productInstanceId: 'QLY-HHHT-001',
        customerName: '呼和浩特市家家悦超市',
        customerCode: 'CUST001',
        cat1: '千里眼',
        cat2: '室内无线WIFI',
        cat3: '标准版',
        terminalModel: 'IPC-V30-W',
        deviceSn: 'SN20260301001',
        city: '呼和浩特市',
        address: '呼和浩特市赛罕区新华东街18号',
        type: '装机',
        completionTime: '2026-03-01 14:30:00'
    },
    {
        id: 'd2',
        ticketNo: 'GZ202603050023',
        subject: '包头某工厂千里眼移机',
        productInstanceId: 'QLY-BT-056',
        customerName: '包头钢铁（集团）有限责任公司',
        customerCode: 'CUST045',
        cat1: '千里眼',
        cat2: '室内外有线',
        cat3: '专业版',
        terminalModel: 'IPC-P50-E',
        deviceSn: 'SN20260305023',
        city: '包头市',
        address: '包头市昆都仑区钢铁大街',
        type: '移机',
        completionTime: '2026-03-05 10:15:00'
    }
];

// Sub-component for Installation/Removal Data Management
const InstallRemoveDataView: React.FC = () => {
    const [filters, setFilters] = useState({
        month: '2026-03',
        city: '',
        cat1: '千里眼',
        cat2: '',
        cat3: ''
    });

    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<BusinessFinanceRecord | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [detailCurrentPage, setDetailCurrentPage] = useState(1);
    const [detailPageSize, setDetailPageSize] = useState(10);

    const filteredData = useMemo(() => {
        return MOCK_LIST.filter(item => {
            if (filters.city && item.city !== filters.city) return false;
            if (filters.cat2 && item.cat2 !== filters.cat2) return false;
            if (filters.cat3 && item.cat3 !== filters.cat3) return false;
            return true;
        });
    }, [filters]);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredData.slice(start, start + pageSize);
    }, [filteredData, currentPage, pageSize]);

    const paginatedDetails = useMemo(() => {
        const start = (detailCurrentPage - 1) * detailPageSize;
        return MOCK_DETAILS.slice(start, start + detailPageSize);
    }, [detailCurrentPage, detailPageSize]);

    const handleDrillDown = (record: BusinessFinanceRecord) => {
        setSelectedRecord(record);
        setDetailCurrentPage(1);
        setIsDetailModalOpen(true);
    };

    const handleExport = () => {
        alert('正在导出业财数据...');
    };

    const handleDetailExport = () => {
        alert('正在导出下钻详情数据...');
    };

    return (
        <div className="relative flex flex-col h-full bg-transparent p-4 gap-4 overflow-hidden">
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-4 bg-[#0c2242]/50 p-4 border border-blue-500/20 rounded-sm">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-blue-300">月份:</span>
                    <StyledInput 
                        type="month" 
                        className="w-40" 
                        value={filters.month}
                        onChange={(e) => setFilters({ ...filters, month: e.target.value })}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-blue-300">地市:</span>
                    <StyledSelect 
                        className="w-32"
                        value={filters.city}
                        onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                    >
                        <option value="">全部</option>
                        {INNER_MONGOLIA_CITIES.map(city => (
                            <option key={city.code} value={city.name}>{city.name}</option>
                        ))}
                    </StyledSelect>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-blue-300">一级分类:</span>
                    <StyledSelect 
                        className="w-32"
                        value={filters.cat1}
                        onChange={(e) => setFilters({ ...filters, cat1: e.target.value })}
                    >
                        <option value="千里眼">千里眼</option>
                    </StyledSelect>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-blue-300">二级分类:</span>
                    <StyledSelect 
                        className="w-40"
                        value={filters.cat2}
                        onChange={(e) => setFilters({ ...filters, cat2: e.target.value })}
                    >
                        <option value="">全部</option>
                        <option value="室内无线WIFI">室内无线WIFI</option>
                        <option value="室内外有线">室内外有线</option>
                    </StyledSelect>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-blue-300">三级分类:</span>
                    <StyledSelect 
                        className="w-32"
                        value={filters.cat3}
                        onChange={(e) => setFilters({ ...filters, cat3: e.target.value })}
                    >
                        <option value="">全部</option>
                        <option value="标准版">标准版</option>
                        <option value="专业版">专业版</option>
                        <option value="企业版">企业版</option>
                    </StyledSelect>
                </div>
                <StyledButton variant="toolbar" icon={<SearchIcon />}>查询</StyledButton>
                <StyledButton variant="secondary" icon={<RefreshCwIcon />} onClick={() => setFilters({ month: '2026-03', city: '', cat1: '千里眼', cat2: '', cat3: '' })}>重置</StyledButton>
            </div>

            {/* Summary Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-blue-600/20 to-blue-900/20 border border-blue-500/30 p-4 rounded-sm flex flex-col justify-center">
                    <span className="text-xs text-blue-300 mb-1">月份</span>
                    <span className="text-xl font-bold text-white">{filters.month || MOCK_SUMMARY.month}</span>
                </div>
                <div className="bg-gradient-to-r from-blue-600/20 to-blue-900/20 border border-blue-500/30 p-4 rounded-sm flex flex-col justify-center">
                    <span className="text-xs text-blue-300 mb-1">本月全省千里眼应结总装移机工料费（元）</span>
                    <span className="text-2xl font-bold text-neon-blue">¥ {MOCK_SUMMARY.totalCost.toLocaleString()}</span>
                </div>
            </div>

            {/* Main Table */}
            <div className="flex-1 overflow-hidden flex flex-col bg-[#0c2242]/30 border border-blue-500/20 rounded-sm">
                <div className="overflow-auto flex-1 scrollbar-thin">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-[#1e3a5f] z-10">
                            <tr>
                                <th className="p-3 text-xs font-semibold text-blue-100 border-b border-blue-500/30">地市</th>
                                <th className="p-3 text-xs font-semibold text-blue-100 border-b border-blue-500/30">一级分类</th>
                                <th className="p-3 text-xs font-semibold text-blue-100 border-b border-blue-500/30">二级分类</th>
                                <th className="p-3 text-xs font-semibold text-blue-100 border-b border-blue-500/30">三级分类</th>
                                <th className="p-3 text-xs font-semibold text-blue-100 border-b border-blue-500/30">装移机量（路）</th>
                                <th className="p-3 text-xs font-semibold text-blue-100 border-b border-blue-500/30">单价（元）</th>
                                <th className="p-3 text-xs font-semibold text-blue-100 border-b border-blue-500/30">装移机费用（元）</th>
                                <th className="p-3 text-xs font-semibold text-blue-100 border-b border-blue-500/30 text-center">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map((record) => (
                                <tr key={record.id} className="hover:bg-blue-500/10 transition-colors border-b border-blue-500/10">
                                    <td className="p-3 text-xs text-white">{record.city}</td>
                                    <td className="p-3 text-xs text-white">{record.cat1}</td>
                                    <td className="p-3 text-xs text-white">{record.cat2}</td>
                                    <td className="p-3 text-xs text-white">{record.cat3}</td>
                                    <td className="p-3 text-xs text-white font-mono">{record.volume}</td>
                                    <td className="p-3 text-xs text-white font-mono">{record.unitPrice}</td>
                                    <td className="p-3 text-xs text-neon-blue font-bold font-mono">{record.totalCost.toLocaleString()}</td>
                                    <td className="p-3 text-xs text-center">
                                        <button 
                                            onClick={() => handleDrillDown(record)}
                                            className="text-neon-blue hover:text-blue-300 transition-colors flex items-center justify-center gap-1 mx-auto"
                                        >
                                            <ZoomInIcon className="w-3 h-3" />
                                            下钻详情
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="bg-[#1e293b]/50 h-[40px] shrink-0 border-t border-blue-500/20 flex items-center px-4 gap-4">
                    <StyledButton variant="toolbar" onClick={handleExport} icon={<DownloadIcon />} className="whitespace-nowrap h-8">导出</StyledButton>
                    <Pagination 
                        currentPage={currentPage}
                        pageSize={pageSize}
                        totalItems={filteredData.length}
                        onPageChange={setCurrentPage}
                        onPageSizeChange={(s) => { setPageSize(s); setCurrentPage(1); }}
                        className="py-0 w-full"
                    />
                </div>
            </div>

            {/* Drill-down Modal */}
            {isDetailModalOpen && (
                <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-[#0b1730] border border-blue-500/40 w-full max-w-6xl max-h-[90vh] flex flex-col shadow-[0_0_50px_rgba(0,210,255,0.3)]">
                        <div className="flex justify-between items-center p-4 border-b border-blue-500/30 bg-[#0c2242]">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                业财数据详情 - {selectedRecord?.city}
                            </h3>
                            <button onClick={() => setIsDetailModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                <XIcon className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto p-4 scrollbar-thin">
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 bg-[#1e3a5f] z-10">
                                    <tr>
                                        <th className="p-2 text-[10px] font-semibold text-blue-100 border-b border-blue-500/30 whitespace-nowrap">工单编号</th>
                                        <th className="p-2 text-[10px] font-semibold text-blue-100 border-b border-blue-500/30 whitespace-nowrap">工单主题</th>
                                        <th className="p-2 text-[10px] font-semibold text-blue-100 border-b border-blue-500/30 whitespace-nowrap">产品实例标识</th>
                                        <th className="p-2 text-[10px] font-semibold text-blue-100 border-b border-blue-500/30 whitespace-nowrap">客户名称</th>
                                        <th className="p-2 text-[10px] font-semibold text-blue-100 border-b border-blue-500/30 whitespace-nowrap">客户编号</th>
                                        <th className="p-2 text-[10px] font-semibold text-blue-100 border-b border-blue-500/30 whitespace-nowrap">一级分类</th>
                                        <th className="p-2 text-[10px] font-semibold text-blue-100 border-b border-blue-500/30 whitespace-nowrap">二级分类</th>
                                        <th className="p-2 text-[10px] font-semibold text-blue-100 border-b border-blue-500/30 whitespace-nowrap">三级分类</th>
                                        <th className="p-2 text-[10px] font-semibold text-blue-100 border-b border-blue-500/30 whitespace-nowrap">终端型号</th>
                                        <th className="p-2 text-[10px] font-semibold text-blue-100 border-b border-blue-500/30 whitespace-nowrap">设备序列号</th>
                                        <th className="p-2 text-[10px] font-semibold text-blue-100 border-b border-blue-500/30 whitespace-nowrap">地市</th>
                                        <th className="p-2 text-[10px] font-semibold text-blue-100 border-b border-blue-500/30 whitespace-nowrap">安装地址</th>
                                        <th className="p-2 text-[10px] font-semibold text-blue-100 border-b border-blue-500/30 whitespace-nowrap">类型</th>
                                        <th className="p-2 text-[10px] font-semibold text-blue-100 border-b border-blue-500/30 whitespace-nowrap">完成时间</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedDetails.map((detail) => (
                                        <tr key={detail.id} className="hover:bg-blue-500/10 border-b border-blue-500/10">
                                            <td className="p-2 text-[10px] text-white font-mono whitespace-nowrap">{detail.ticketNo}</td>
                                            <td className="p-2 text-[10px] text-white whitespace-nowrap" title={detail.subject}>{detail.subject}</td>
                                            <td className="p-2 text-[10px] text-blue-300 font-mono whitespace-nowrap">{detail.productInstanceId}</td>
                                            <td className="p-2 text-[10px] text-white whitespace-nowrap">{detail.customerName}</td>
                                            <td className="p-2 text-[10px] text-gray-400 font-mono whitespace-nowrap">{detail.customerCode}</td>
                                            <td className="p-2 text-[10px] text-white whitespace-nowrap">{detail.cat1}</td>
                                            <td className="p-2 text-[10px] text-white whitespace-nowrap">{detail.cat2}</td>
                                            <td className="p-2 text-[10px] text-white whitespace-nowrap">{detail.cat3}</td>
                                            <td className="p-2 text-[10px] text-white whitespace-nowrap">{detail.terminalModel}</td>
                                            <td className="p-2 text-[10px] text-gray-400 font-mono whitespace-nowrap">{detail.deviceSn}</td>
                                            <td className="p-2 text-[10px] text-white whitespace-nowrap">{detail.city}</td>
                                            <td className="p-2 text-[10px] text-white whitespace-nowrap" title={detail.address}>{detail.address}</td>
                                            <td className="p-2 text-[10px] text-white whitespace-nowrap">
                                                <span className={`px-1 rounded ${detail.type === '装机' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                                    {detail.type}
                                                </span>
                                            </td>
                                            <td className="p-2 text-[10px] text-gray-400 font-mono whitespace-nowrap">{detail.completionTime}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-2 border-t border-blue-500/30 bg-[#0c2242] flex items-center justify-between px-4">
                            <div className="flex items-center gap-4 flex-1">
                                <StyledButton variant="toolbar" onClick={handleDetailExport} icon={<DownloadIcon />} className="whitespace-nowrap h-8">导出</StyledButton>
                                <Pagination 
                                    currentPage={detailCurrentPage}
                                    pageSize={detailPageSize}
                                    totalItems={MOCK_DETAILS.length}
                                    onPageChange={setDetailCurrentPage}
                                    onPageSizeChange={(s) => { setDetailPageSize(s); setDetailCurrentPage(1); }}
                                    className="py-0 w-full"
                                />
                            </div>
                            <StyledButton onClick={() => setIsDetailModalOpen(false)} className="ml-4">关闭</StyledButton>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Sub-component for Maintenance Data Management
const MaintenanceDataView: React.FC = () => {
    const [filters, setFilters] = useState({
        month: '2026-03',
        city: '',
        cat1: '千里眼',
        cat2: '',
        cat3: ''
    });

    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<MaintenanceRecord | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [detailCurrentPage, setDetailCurrentPage] = useState(1);
    const [detailPageSize, setDetailPageSize] = useState(10);

    const filteredData = useMemo(() => {
        return MOCK_MAINTENANCE_LIST.filter(item => {
            if (filters.city && item.city !== filters.city) return false;
            if (filters.cat1 && item.cat1 !== filters.cat1) return false;
            if (filters.cat2 && item.cat2 !== filters.cat2) return false;
            if (filters.cat3 && item.cat3 !== filters.cat3) return false;
            return true;
        });
    }, [filters]);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredData.slice(start, start + pageSize);
    }, [filteredData, currentPage, pageSize]);

    const paginatedDetails = useMemo(() => {
        const start = (detailCurrentPage - 1) * detailPageSize;
        return MOCK_MAINTENANCE_DETAILS.slice(start, start + detailPageSize);
    }, [detailCurrentPage, detailPageSize]);

    const handleDrillDown = (record: MaintenanceRecord) => {
        setSelectedRecord(record);
        setDetailCurrentPage(1);
        setIsDetailModalOpen(true);
    };

    const handleExport = () => alert('正在导出维护数据...');
    const handleDetailExport = () => alert('正在导出维护详情...');

    return (
        <div className="relative flex flex-col h-full bg-transparent p-4 gap-4 overflow-hidden">
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-4 bg-[#0c2242]/50 p-4 border border-blue-500/20 rounded-sm">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-blue-300">月份:</span>
                    <StyledInput type="month" className="w-40" value={filters.month} onChange={(e) => setFilters({ ...filters, month: e.target.value })} />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-blue-300">地市:</span>
                    <StyledSelect className="w-32" value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })}>
                        <option value="">全部</option>
                        {INNER_MONGOLIA_CITIES.map(city => (
                            <option key={city.code} value={city.name}>{city.name}</option>
                        ))}
                    </StyledSelect>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-blue-300">一级分类:</span>
                    <StyledSelect 
                        className="w-32"
                        value={filters.cat1}
                        onChange={(e) => setFilters({ ...filters, cat1: e.target.value })}
                    >
                        <option value="千里眼">千里眼</option>
                    </StyledSelect>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-blue-300">二级分类:</span>
                    <StyledSelect 
                        className="w-40"
                        value={filters.cat2}
                        onChange={(e) => setFilters({ ...filters, cat2: e.target.value })}
                    >
                        <option value="">全部</option>
                        <option value="室内无线WIFI">室内无线WIFI</option>
                        <option value="室内外有线">室内外有线</option>
                    </StyledSelect>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-blue-300">三级分类:</span>
                    <StyledSelect 
                        className="w-32"
                        value={filters.cat3}
                        onChange={(e) => setFilters({ ...filters, cat3: e.target.value })}
                    >
                        <option value="">全部</option>
                        <option value="标准版">标准版</option>
                        <option value="专业版">专业版</option>
                        <option value="企业版">企业版</option>
                    </StyledSelect>
                </div>
                <StyledButton variant="toolbar" icon={<SearchIcon />}>查询</StyledButton>
                <StyledButton variant="secondary" icon={<RefreshCwIcon />} onClick={() => setFilters({ month: '2026-03', city: '', cat1: '千里眼', cat2: '', cat3: '' })}>重置</StyledButton>
            </div>

            {/* Summary Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-blue-600/20 to-blue-900/20 border border-blue-500/30 p-4 rounded-sm flex flex-col justify-center">
                    <span className="text-xs text-blue-300 mb-1">月份</span>
                    <span className="text-xl font-bold text-white">{filters.month}</span>
                </div>
                <div className="bg-gradient-to-r from-blue-600/20 to-blue-900/20 border border-blue-500/30 p-4 rounded-sm flex flex-col justify-center">
                    <span className="text-xs text-blue-300 mb-1">本月全省千里眼总维护费用（元）</span>
                    <span className="text-2xl font-bold text-neon-blue">¥ {filteredData.reduce((sum, r) => sum + r.totalCost, 0).toLocaleString()}</span>
                </div>
            </div>

            {/* Main Table */}
            <div className="flex-1 overflow-hidden flex flex-col bg-[#0c2242]/30 border border-blue-500/20 rounded-sm">
                <div className="overflow-auto flex-1 scrollbar-thin">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-[#1e3a5f] z-10">
                            <tr>
                                <th className="p-3 text-xs font-semibold text-blue-100 border-b border-blue-500/30">地市</th>
                                <th className="p-3 text-xs font-semibold text-blue-100 border-b border-blue-500/30">一级分类</th>
                                <th className="p-3 text-xs font-semibold text-blue-100 border-b border-blue-500/30">二级分类</th>
                                <th className="p-3 text-xs font-semibold text-blue-100 border-b border-blue-500/30">三级分类</th>
                                <th className="p-3 text-xs font-semibold text-blue-100 border-b border-blue-500/30">维护规模（路）</th>
                                <th className="p-3 text-xs font-semibold text-blue-100 border-b border-blue-500/30">维护单价（元/端·月）</th>
                                <th className="p-3 text-xs font-semibold text-blue-100 border-b border-blue-500/30">维护费用（元）</th>
                                <th className="p-3 text-xs font-semibold text-blue-100 border-b border-blue-500/30 text-center">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map((record) => (
                                <tr key={record.id} className="hover:bg-blue-500/10 transition-colors border-b border-blue-500/10">
                                    <td className="p-3 text-xs text-white">{record.city}</td>
                                    <td className="p-3 text-xs text-white">{record.cat1}</td>
                                    <td className="p-3 text-xs text-white">{record.cat2}</td>
                                    <td className="p-3 text-xs text-white">{record.cat3}</td>
                                    <td className="p-3 text-xs text-white font-mono">{record.volume}</td>
                                    <td className="p-3 text-xs text-white font-mono">{record.unitPrice}</td>
                                    <td className="p-3 text-xs text-neon-blue font-bold font-mono">{record.totalCost.toLocaleString()}</td>
                                    <td className="p-3 text-xs text-center">
                                        <button onClick={() => handleDrillDown(record)} className="text-neon-blue hover:text-blue-300 transition-colors flex items-center justify-center gap-1 mx-auto">
                                            <ZoomInIcon className="w-3 h-3" /> 下钻详情
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="bg-[#1e293b]/50 h-[40px] shrink-0 border-t border-blue-500/20 flex items-center px-4 gap-4">
                    <StyledButton variant="toolbar" onClick={handleExport} icon={<DownloadIcon />} className="whitespace-nowrap h-8">导出</StyledButton>
                    <Pagination currentPage={currentPage} pageSize={pageSize} totalItems={filteredData.length} onPageChange={setCurrentPage} onPageSizeChange={(s) => { setPageSize(s); setCurrentPage(1); }} className="py-0 w-full" />
                </div>
            </div>

            {/* Drill-down Modal */}
            {isDetailModalOpen && (
                <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-[#0b1730] border border-blue-500/40 w-full max-w-6xl max-h-[90vh] flex flex-col shadow-[0_0_50px_rgba(0,210,255,0.3)]">
                        <div className="flex justify-between items-center p-4 border-b border-blue-500/30 bg-[#0c2242]">
                            <h3 className="text-lg font-bold text-white">维护数据详情 - {selectedRecord?.city}</h3>
                            <button onClick={() => setIsDetailModalOpen(false)} className="text-gray-400 hover:text-white transition-colors"><XIcon className="w-6 h-6" /></button>
                        </div>
                        <div className="flex-1 overflow-auto p-4 scrollbar-thin">
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 bg-[#1e3a5f] z-10">
                                    <tr>
                                        {['产品实例标识', '客户名称', '客户编号', '一级分类', '二级分类', '三级分类', '终端型号', '设备序列号', 'MAC地址', '地市', '安装地址'].map(h => <th key={h} className="p-2 text-[10px] font-semibold text-blue-100 border-b border-blue-500/30 whitespace-nowrap">{h}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedDetails.map((detail) => (
                                        <tr key={detail.id} className="hover:bg-blue-500/10 border-b border-blue-500/10">
                                            <td className="p-2 text-[10px] text-blue-300 font-mono whitespace-nowrap">{detail.productInstanceId}</td>
                                            <td className="p-2 text-[10px] text-white whitespace-nowrap">{detail.customerName}</td>
                                            <td className="p-2 text-[10px] text-gray-400 font-mono whitespace-nowrap">{detail.customerCode}</td>
                                            <td className="p-2 text-[10px] text-white whitespace-nowrap">{detail.cat1}</td>
                                            <td className="p-2 text-[10px] text-white whitespace-nowrap">{detail.cat2}</td>
                                            <td className="p-2 text-[10px] text-white whitespace-nowrap">{detail.cat3}</td>
                                            <td className="p-2 text-[10px] text-white whitespace-nowrap">{detail.terminalModel}</td>
                                            <td className="p-2 text-[10px] text-gray-400 font-mono whitespace-nowrap">{detail.deviceSn}</td>
                                            <td className="p-2 text-[10px] text-gray-400 font-mono whitespace-nowrap">{detail.macAddress}</td>
                                            <td className="p-2 text-[10px] text-white whitespace-nowrap">{detail.city}</td>
                                            <td className="p-2 text-[10px] text-white whitespace-nowrap">{detail.address}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-2 border-t border-blue-500/30 bg-[#0c2242] flex items-center justify-between px-4">
                            <div className="flex items-center gap-4 flex-1">
                                <StyledButton variant="toolbar" onClick={handleDetailExport} icon={<DownloadIcon />} className="whitespace-nowrap h-8">导出</StyledButton>
                                <Pagination currentPage={detailCurrentPage} pageSize={detailPageSize} totalItems={MOCK_MAINTENANCE_DETAILS.length} onPageChange={setDetailCurrentPage} onPageSizeChange={(s) => { setDetailPageSize(s); setDetailCurrentPage(1); }} className="py-0 w-full" />
                            </div>
                            <StyledButton onClick={() => setIsDetailModalOpen(false)} className="ml-4">关闭</StyledButton>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const PlaceholderView: React.FC<{ title: string }> = ({ title }) => (
    <div className="flex flex-col items-center justify-center h-full text-blue-300/50">
        <div className="text-6xl mb-4">📊</div>
        <div className="text-xl font-bold">{title}</div>
        <div className="mt-2 text-sm">功能开发中，敬请期待...</div>
    </div>
);

export const BusinessFinanceDataView: React.FC = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [tabs, setTabs] = useState<{ id: string, label: string }[]>([
        { id: 'install-remove', label: '装移机数据管理' }
    ]);
    const [activeTabId, setActiveTabId] = useState<string>('install-remove');
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, tabId: string } | null>(null);

    React.useEffect(() => {
        const handleClick = () => setContextMenu(null);
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);

    const sidebarItems = [
        { id: 'install-remove', label: '装移机数据管理', icon: <BarChartIcon /> },
        { id: 'maintenance', label: '维护量数据管理', icon: <TrendingUpIcon /> },
        { id: 'fault-ticket', label: '报障工单数据管理', icon: <BellIcon /> },
        { id: 'cost-unit', label: '费用单价管理', icon: <SettingsIcon /> },
    ];

    const handleSidebarClick = (item: { id: string, label: string }) => {
        if (!tabs.find(t => t.id === item.id)) {
            setTabs([...tabs, { id: item.id, label: item.label }]);
        }
        setActiveTabId(item.id);
    };

    const handleCloseTab = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (tabs.length === 1) return; // Keep at least one tab
        
        const newTabs = tabs.filter(t => t.id !== id);
        setTabs(newTabs);
        
        if (activeTabId === id) {
            setActiveTabId(newTabs[newTabs.length - 1].id);
        }
    };

    return (
        <div className="flex flex-1 overflow-hidden h-full">
            {/* Sidebar */}
            <div className={`${isSidebarCollapsed ? 'w-[53px]' : 'w-48'} bg-transparent border border-blue-500/30 mr-2 transition-all duration-500 ease-in-out flex flex-col shadow-[0_0_15px_rgba(0,0,0,0.3)]`}>
                <div className={`h-[35px] flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between px-3'} border-b border-blue-500/20 bg-transparent shrink-0`}> 
                    {!isSidebarCollapsed && <span className="text-blue-100 font-bold tracking-wider text-[12px] whitespace-nowrap">业务数据管理</span>}
                    <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="text-blue-300 hover:text-white transition-colors flex items-center justify-center"> 
                        <div className="w-5 h-5 flex items-center justify-center">{isSidebarCollapsed ? <SidebarOpenIcon /> : <SidebarCloseIcon />}</div> 
                    </button> 
                </div>
                <div className="flex-1 py-2 overflow-y-auto custom-scrollbar flex flex-col gap-1">
                    {sidebarItems.map(item => (
                        <div 
                            key={item.id} 
                            onClick={() => handleSidebarClick(item)} 
                            className={`relative flex items-center gap-3 px-3 py-2 cursor-pointer transition-all mx-1 rounded-sm ${activeTabId === item.id ? 'bg-gradient-to-r from-blue-600/40 to-blue-600/10 text-white border-l-2 border-neon-blue shadow-[0_0_10px_rgba(0,210,255,0.2)]' : 'text-white/80 hover:bg-white/10 hover:text-white border-l-2 border-transparent'} ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
                            title={isSidebarCollapsed ? item.label : ''}
                        >
                            <div className="w-5 h-5 flex items-center justify-center shrink-0 relative">{item.icon}</div>
                            {!isSidebarCollapsed && <span className="text-sm whitespace-nowrap truncate">{item.label}</span>}
                        </div>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-full border border-blue-500/30 shadow-[inset_0_0_20px_rgba(0,133,208,0.1)] bg-[#0c1a35]/10">
                {/* Internal Tabs */}
                <div className="flex items-end gap-[6px] pl-0 pr-4 h-[35px] mt-px border-b border-blue-500/20 bg-[#0c1a35]/20 shrink-0 overflow-x-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
                    {tabs.map((tab) => {
                        const isActive = activeTabId === tab.id;
                        return (
                            <div 
                                key={tab.id} 
                                onClick={() => setActiveTabId(tab.id)}
                                onContextMenu={(e) => {
                                    e.preventDefault();
                                    setContextMenu({ x: e.clientX, y: e.clientY, tabId: tab.id });
                                }}
                                className={`
                                    relative flex items-center justify-center h-full cursor-pointer transition-all duration-300 min-w-[90px] px-3 overflow-hidden group
                                    ${isActive 
                                        ? 'z-10' 
                                        : 'border-t border-x border-blue-500/30 border-b-transparent hover:bg-blue-500/5 opacity-80 hover:opacity-100 bg-[#094F8B]/[0.05]'}
                                `}
                            >
                                {isActive && (
                                    <>
                                        <div className="absolute inset-0 bg-gradient-to-b from-[#00d2ff]/10 to-transparent pointer-events-none" />
                                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-neon-blue shadow-[0_0_10px_#00d2ff] pointer-events-none" />
                                        <div className="absolute top-0 left-0 bottom-0 w-[1px] bg-gradient-to-b from-neon-blue via-neon-blue/50 to-transparent pointer-events-none" />
                                        <div className="absolute top-0 right-0 bottom-0 w-[1px] bg-gradient-to-b from-neon-blue via-neon-blue/50 to-transparent pointer-events-none" />
                                    </>
                                )}
                                <span className={`relative z-10 text-sm font-medium tracking-wide whitespace-nowrap truncate max-w-[120px] ${isActive ? 'text-white font-bold' : 'text-gray-300'}`}>{tab.label}</span> 
                                <button onClick={(e) => handleCloseTab(e, tab.id)} className={`relative z-10 ml-2 p-0.5 rounded-full hover:bg-blue-500/20 transition-colors ${isActive ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100 text-gray-400'}`}> <XIcon /> </button> 
                            </div> 
                        );
                    })}
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-hidden relative">
                    {tabs.map((tab) => (
                        <div key={tab.id} className={`h-full ${activeTabId === tab.id ? 'block' : 'hidden'}`}>
                            {tab.id === 'install-remove' ? <InstallRemoveDataView /> : 
                             tab.id === 'maintenance' ? <MaintenanceDataView /> : 
                             <PlaceholderView title={tab.label} />}
                        </div>
                    ))}
                </div>

                {/* Context Menu */}
                {contextMenu && (
                    <div 
                        className="fixed z-[9999] bg-[#0A3458]/95 border border-blue-500/30 shadow-[0_0_15px_rgba(0,0,0,0.5)] backdrop-blur-md py-1 w-32 rounded-sm animate-[fadeIn_0.1s_ease-out]"
                        style={{ top: contextMenu.y, left: contextMenu.x }}
                    >
                        <div 
                            className="px-4 py-2 hover:bg-[#1e3a5f]/80 cursor-pointer text-xs text-blue-100 hover:text-white transition-colors" 
                            onClick={() => {
                                handleCloseTab({ stopPropagation: () => {} } as any, contextMenu.tabId);
                                setContextMenu(null);
                            }}
                        >
                            关闭当前标签
                        </div>
                        <div 
                            className="px-4 py-2 hover:bg-[#1e3a5f]/80 cursor-pointer text-xs text-blue-100 hover:text-white transition-colors" 
                            onClick={() => {
                                const tabToKeep = tabs.find(t => t.id === contextMenu.tabId);
                                if (tabToKeep) {
                                    setTabs([tabToKeep]);
                                    setActiveTabId(tabToKeep.id);
                                }
                                setContextMenu(null);
                            }}
                        >
                            关闭其他标签
                        </div>
                        <div 
                            className="px-4 py-2 hover:bg-[#1e3a5f]/80 cursor-pointer text-xs text-blue-100 hover:text-white transition-colors" 
                            onClick={() => {
                                if (tabs.length > 0) {
                                    const firstTab = tabs[0];
                                    setTabs([firstTab]);
                                    setActiveTabId(firstTab.id);
                                }
                                setContextMenu(null);
                            }}
                        >
                            关闭所有标签
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
