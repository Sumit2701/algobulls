
import React, { useState, useEffect } from 'react';
import AntdTable from 'antd';
import 'antd';
import Input from 'antd/lib/input';
import 'antd/lib/input/style/css';
import moment from 'moment';

export const ToDoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState({ key: '', order: '' });
  const [filters, setFilters] = useState({ title: '', description: '', dueDate: '', tag: '' });
  const [pagination, setPagination] = useState({ pageSize: 5, pageNumber: 1 });

  // Fetch mock data
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then((response) => response.json())
      .then((data) => setTasks(data));
  }, []);

  // Search
  const handleSearch = (value) => {
    setSearch(value);
  };

  // Sorting
  const handleSort = (key, order) => {
    setSort({ key, order });
  };

  // Filtering
  const handleFilter = (key, value) => {
    const newFilters = { ...filters };
    newFilters[key] = value;
    setFilters(newFilters);
  };

  // Pagination
  const handlePageChange = (pageNumber, pageSize) => {
    setPagination({ pageNumber, pageSize });
  };

  // Add a new to-do entry
  const handleTaskAdd = (task) => {
    const newTask = {
      ...task,
      timestampCreated: moment().format('DD/MM/YYYY HH:mm:ss'),
      status: 'OPEN'
    };
    setTasks([...tasks, newTask]);
  };

  // Modify an existing to-do entry
  const handleTaskEdit = (id, task) => {
    const updatedTasks = tasks.map((t) => (t.id === id ? task : t));
    setTasks(updatedTasks);
  };

  // Delete an existing to-do entry
  const handleTaskDelete = (id) => {
    const updatedTasks = tasks.filter((t) => t.id !== id);
    setTasks(updatedTasks);
  };

  // Render table
  const renderTable = () => {
    const columns = [
      {
        title: 'Timestamp created',
        dataIndex: 'timestampCreated',
        sorter: (a, b) => a.timestampCreated > b.timestampCreated ? 1 : -1,
        key: 'timestampCreated'
      },
      {
        title: 'Title',
        dataIndex: 'title',
        sorter: (a, b) => a.title > b.title ? 1 : -1,
        key: 'title',
        render: (text, record) => (
          <Input
            value={text}
            onChange={(e) => handleTaskEdit(record.id, { ...record, title: e.target.value })}
            maxLength={100}
            placeholder="Enter title"
            required
          />
        )
      },
      {
        title: 'Description',
        dataIndex: 'description',
        sorter: (a, b) => a.description > b.description ? 1 : -1,
        key: 'description',
        render: (text, record) => (
          <Input
            value={text}
            onChange={(e) => handleTaskEdit(record.id, { ...record, description: e.target.value })}
            maxLength={1000}
            placeholder="Enter description"
            required
          />
        )
      },
      {
        title: 'Due Date',
        dataIndex: 'dueDate',
        sorter: (a, b) => a.dueDate > b.dueDate ? 1 : -1,
        key: 'dueDate',
        render: (text, record) => (
          <Input
            value={text}
            onChange={(e) => handleTaskEdit(record.id, { ...record, dueDate: e.target.value })}
            placeholder="Enter due date"
          />
        )
      },
      {
        title: 'Tag',
        dataIndex: 'tag',
        sorter: (a, b) => a.tag > b.tag ? 1 : -1,
        key: 'tag',
        render: (text, record) => (
          <Input
            value={text}
            onChange={(e) => handleTaskEdit(record.id, { ...record, tag: e.target.value })}
            placeholder="Enter tag"
          />
        )
      },
      {
        title: 'Status',
        dataIndex: 'status',
        sorter: (a, b) => a.status > b.status ? 1 : -1,
        key: 'status',
        render: (text, record) => (
          <Input
            value={text}
            onChange={(e) => handleTaskEdit(record.id, { ...record, status: e.target.value })}
            placeholder="Enter status"
            required
          />
        )
      },
      {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions',
        render: (text, record) => (
          <span>
            <a href="#!" onClick={() => handleTaskDelete(record.id)}>Delete</a>
          </span>
        )
      },
    ];

    let dataSource = tasks;

    // Search
    if (search) {
      dataSource = dataSource.filter(
        (task) => (
          task.title.toLowerCase().includes(search.toLowerCase()) ||
          task.description.toLowerCase().includes(search.toLowerCase()) ||
          task.tag.toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    // Filtering
    dataSource = dataSource.filter(
      (task) => (
        (filters.title === '' || task.title.toLowerCase() === filters.title.toLowerCase()) &&
        (filters.description === '' || task.description.toLowerCase() === filters.description.toLowerCase()) &&
        (filters.dueDate === '' || task.dueDate.toLowerCase() === filters.dueDate.toLowerCase()) &&
        (filters.tag === '' || task.tag.toLowerCase() === filters.tag.toLowerCase())
      )
    );

    // Sorting
    if (sort.key) {
      dataSource = dataSource.sort(
        (a, b) => (sort.order === 'ascend' ? a[sort.key] > b[sort.key] : a[sort.key] < b[sort.key]) ? 1 : -1
      );
    }

    // Pagination
    const total = dataSource.length;
    dataSource = dataSource
      .slice((pagination.pageNumber - 1) * pagination.pageSize, pagination.pageNumber * pagination.pageSize);

    return (
      <AntdTable
        columns={columns}
        dataSource={dataSource}
        pagination={{
          pageSize: pagination.pageSize,
          total,
          onChange: (pageNumber, pageSize) => handlePageChange(pageNumber, pageSize)
        }}
        onChange={(pagination, filters, sorter) => handleSort(sorter.field, sorter.order)}
      />
    );
  };

  return (
    <div>
      <Input
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search by title, description, tag"
      />
      {renderTable()}
    </div>
  );
};

export default ToDoApp;