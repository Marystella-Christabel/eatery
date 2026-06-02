import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, UtensilsCrossed, ShoppingCart, DollarSign,
  Plus, Search, Pencil, Trash2, X, AlertTriangle, PackageX,
  ShieldX, CheckCircle, MessageSquare, Users, TrendingUp,
  Clock, ChefHat, Truck, XCircle, Mail, Calendar, Eye,
} from 'lucide-react';
import {
  fetchAdminStats, fetchAdminMenu, addMenuItem, updateMenuItem,
  deleteMenuItem, toggleMenuAvailability, clearAdminError, clearSuccessMessage,
  fetchAdminOrders, updateOrderStatus, fetchAdminMessages, deleteAdminMessage,
  fetchAdminCustomers,
} from '../store/adminSlice';
import './AdminDashboard.css';

const CATEGORIES = ['Rice', 'Swallow', 'Grill', 'Soups', 'Sides', 'Drinks'];
const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'customers', label: 'Customers', icon: Users },
];
const ORDER_STATUSES = ['pending', 'confirmed', 'preparing', 'delivered', 'cancelled'];
const STATUS_CONFIG = {
  pending: { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', icon: Clock, label: 'Pending' },
  confirmed: { color: '#3B82F6', bg: 'rgba(59,130,246,0.12)', icon: CheckCircle, label: 'Confirmed' },
  preparing: { color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)', icon: ChefHat, label: 'Preparing' },
  delivered: { color: '#10B981', bg: 'rgba(16,185,129,0.12)', icon: Truck, label: 'Delivered' },
  cancelled: { color: '#EF4444', bg: 'rgba(239,68,68,0.12)', icon: XCircle, label: 'Cancelled' },
};

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((s) => s.auth);
  const {
    menuItems, stats, loading, statsLoading, error, successMessage,
    orders, ordersLoading, messages, messagesLoading, customers, customersLoading,
  } = useSelector((s) => s.admin);

  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [formData, setFormData] = useState({
    title: '', description: '', price: '', category: 'Rice', image_url: '',
  });

  const isAdmin = isAuthenticated && user?.role === 'admin';

  useEffect(() => {
    if (isAdmin) {
      dispatch(fetchAdminStats());
      dispatch(fetchAdminMenu());
    }
  }, [dispatch, isAdmin]);

  // Load tab-specific data
  useEffect(() => {
    if (!isAdmin) return;
    if (activeTab === 'orders') dispatch(fetchAdminOrders(orderStatusFilter));
    if (activeTab === 'messages') dispatch(fetchAdminMessages());
    if (activeTab === 'customers') dispatch(fetchAdminCustomers());
  }, [dispatch, isAdmin, activeTab, orderStatusFilter]);

  useEffect(() => {
    if (successMessage) {
      const t = setTimeout(() => dispatch(clearSuccessMessage()), 3000);
      return () => clearTimeout(t);
    }
  }, [successMessage, dispatch]);

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => dispatch(clearAdminError()), 4000);
      return () => clearTimeout(t);
    }
  }, [error, dispatch]);

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="admin-dashboard container">
        <div className="admin-access-denied">
          <div className="denied-icon"><ShieldX size={36} /></div>
          <h2>Access Denied</h2>
          <p>You need administrator privileges to access this page. Please sign in with an admin account.</p>
          <Link to="/signin" className="btn-go-home">Sign In</Link>
        </div>
      </div>
    );
  }

  // ========== MENU HELPERS ==========
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = activeFilter === 'All' || item.category === activeFilter;
    return matchesSearch && matchesCategory;
  });

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({ title: '', description: '', price: '', category: 'Rice', image_url: '' });
    setShowModal(true);
  };
  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({ title: item.title, description: item.description || '', price: String(item.price), category: item.category, image_url: item.image_url || '' });
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditingItem(null); };
  const openDeleteModal = (item) => { setDeleteTarget(item); setShowDeleteModal(true); };
  const closeDeleteModal = () => { setShowDeleteModal(false); setDeleteTarget(null); };
  const handleFormChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { title: formData.title.trim(), description: formData.description.trim(), price: parseFloat(formData.price), category: formData.category, image_url: formData.image_url.trim() };
    if (!data.title || !data.price || !data.category) return;
    if (editingItem) await dispatch(updateMenuItem({ id: editingItem.id, data }));
    else await dispatch(addMenuItem(data));
    dispatch(fetchAdminStats());
    closeModal();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await dispatch(deleteMenuItem(deleteTarget.id));
    dispatch(fetchAdminStats());
    closeDeleteModal();
  };

  const handleToggle = (item) => {
    dispatch(toggleMenuAvailability(item.id)).then(() => dispatch(fetchAdminStats()));
  };

  // ========== ORDER HELPERS ==========
  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ id: orderId, status: newStatus }));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  // Recent orders for overview
  const recentOrders = orders.slice(0, 5);

  // ========== RENDER TABS ==========

  const renderOverview = () => (
    <>
      <div className="admin-stats">
        {[
          { icon: UtensilsCrossed, val: stats.totalItems, label: 'Total Items' },
          { icon: CheckCircle, val: stats.availableItems, label: 'Available' },
          { icon: ShoppingCart, val: stats.totalOrders, label: 'Total Orders' },
          { icon: DollarSign, val: `₦${Number(stats.totalRevenue).toLocaleString()}`, label: 'Revenue' },
        ].map(({ icon: Icon, val, label }, i) => (
          <div className="stat-card glass" key={label}>
            <div className="stat-icon"><Icon size={22} /></div>
            <div className="stat-value">{statsLoading ? '—' : val}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      <div className="overview-grid">
        <div className="overview-section glass">
          <div className="section-header">
            <h3><TrendingUp size={18} style={{ marginRight: 8, verticalAlign: 'text-bottom' }} />Recent Orders</h3>
            <button className="btn-view-all" onClick={() => setActiveTab('orders')}>View All</button>
          </div>
          {ordersLoading ? (
            <div className="admin-loading"><div className="admin-spinner" /><p>Loading...</p></div>
          ) : recentOrders.length === 0 ? (
            <p className="empty-hint">No orders yet</p>
          ) : (
            <div className="recent-orders-list">
              {recentOrders.map((order) => {
                const sc = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                return (
                  <div className="recent-order-row" key={order.id}>
                    <div className="ro-info">
                      <span className="ro-id">#{order.id}</span>
                      <span className="ro-name">{order.customer_name}</span>
                    </div>
                    <span className="status-badge" style={{ color: sc.color, background: sc.bg }}>{sc.label}</span>
                    <span className="ro-total">₦{Number(order.total).toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="overview-section glass">
          <div className="section-header">
            <h3><MessageSquare size={18} style={{ marginRight: 8, verticalAlign: 'text-bottom' }} />Messages</h3>
            <button className="btn-view-all" onClick={() => setActiveTab('messages')}>View All</button>
          </div>
          <div className="overview-stat-row">
            <Mail size={20} className="overview-stat-icon" />
            <div>
              <div className="overview-stat-num">{messages.length}</div>
              <div className="overview-stat-lbl">Customer Messages</div>
            </div>
          </div>
          <div className="overview-stat-row">
            <Users size={20} className="overview-stat-icon" />
            <div>
              <div className="overview-stat-num">{customers.length}</div>
              <div className="overview-stat-lbl">Registered Customers</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderMenu = () => (
    <>
      <div className="admin-toolbar">
        <div className="toolbar-left">
          <div className="admin-search">
            <Search size={16} className="search-icon" />
            <input id="admin-search-input" type="text" placeholder="Search menu items..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <div className="category-filter">
            {['All', ...CATEGORIES].map((cat) => (
              <button key={cat} className={`filter-chip ${activeFilter === cat ? 'active' : ''}`} onClick={() => setActiveFilter(cat)}>{cat}</button>
            ))}
          </div>
        </div>
        <button id="add-menu-item-btn" className="btn-add-item" onClick={openAddModal}><Plus size={18} />Add Item</button>
      </div>

      {loading ? (
        <div className="admin-loading"><div className="admin-spinner" /><p>Loading menu items...</p></div>
      ) : filteredItems.length === 0 ? (
        <div className="admin-empty glass">
          <div className="empty-icon"><PackageX size={36} /></div>
          <h3>No menu items found</h3>
          <p>{searchQuery || activeFilter !== 'All' ? 'Try adjusting your search or filter' : 'Add your first menu item to get started'}</p>
        </div>
      ) : (
        <div className="admin-table-wrapper glass">
          <table className="admin-table">
            <thead><tr><th>Item</th><th>Category</th><th>Price</th><th>Available</th><th>Actions</th></tr></thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="item-info">
                      <div className="item-thumb">{item.image_url ? <img src={item.image_url} alt={item.title} /> : <span className="item-thumb-placeholder">🍽️</span>}</div>
                      <div><div className="item-name">{item.title}</div><div className="item-desc">{item.description}</div></div>
                    </div>
                  </td>
                  <td><span className="item-category">{item.category}</span></td>
                  <td><span className="item-price">₦{Number(item.price).toLocaleString()}</span></td>
                  <td>
                    <label className="toggle-switch">
                      <input type="checkbox" checked={item.available === 1} onChange={() => handleToggle(item)} />
                      <span className="toggle-slider" />
                    </label>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-action btn-edit" title="Edit item" onClick={() => openEditModal(item)}><Pencil size={15} /></button>
                      <button className="btn-action btn-delete" title="Delete item" onClick={() => openDeleteModal(item)}><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );

  const renderOrders = () => (
    <>
      <div className="admin-toolbar">
        <div className="toolbar-left">
          <div className="category-filter">
            {['all', ...ORDER_STATUSES].map((st) => (
              <button key={st} className={`filter-chip ${orderStatusFilter === st ? 'active' : ''}`} onClick={() => setOrderStatusFilter(st)}>
                {st === 'all' ? 'All' : STATUS_CONFIG[st]?.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {ordersLoading ? (
        <div className="admin-loading"><div className="admin-spinner" /><p>Loading orders...</p></div>
      ) : orders.length === 0 ? (
        <div className="admin-empty glass">
          <div className="empty-icon"><PackageX size={36} /></div>
          <h3>No orders found</h3>
          <p>Orders will appear here when customers place them</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const sc = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
            const StatusIcon = sc.icon;
            const isExpanded = expandedOrder === order.id;
            return (
              <div className="order-card glass" key={order.id}>
                <div className="order-card-header" onClick={() => setExpandedOrder(isExpanded ? null : order.id)}>
                  <div className="order-card-left">
                    <span className="order-id">#{order.id}</span>
                    <span className="order-customer">{order.customer_name}</span>
                    <span className="order-date">{formatDate(order.created_at)}</span>
                  </div>
                  <div className="order-card-right">
                    <span className="status-badge" style={{ color: sc.color, background: sc.bg }}>
                      <StatusIcon size={13} style={{ marginRight: 4 }} />{sc.label}
                    </span>
                    <span className="order-total">₦{Number(order.total).toLocaleString()}</span>
                    <Eye size={16} className={`expand-icon ${isExpanded ? 'expanded' : ''}`} />
                  </div>
                </div>
                {isExpanded && (
                  <div className="order-card-body">
                    <div className="order-detail-row">
                      <span className="detail-label">Phone:</span><span>{order.customer_phone}</span>
                    </div>
                    <div className="order-detail-row">
                      <span className="detail-label">Type:</span><span className="delivery-badge">{order.delivery_type}</span>
                    </div>
                    {order.customer_address && (
                      <div className="order-detail-row">
                        <span className="detail-label">Address:</span><span>{order.customer_address}</span>
                      </div>
                    )}
                    {order.items && order.items.length > 0 && (
                      <div className="order-items-section">
                        <span className="detail-label">Items:</span>
                        <ul className="order-items-list">
                          {order.items.map((it, idx) => (
                            <li key={idx}>{it.title} × {it.quantity} — ₦{Number(it.price * it.quantity).toLocaleString()}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="order-status-update">
                      <span className="detail-label">Update Status:</span>
                      <div className="status-btns">
                        {ORDER_STATUSES.filter((s) => s !== order.status).map((s) => {
                          const cfg = STATUS_CONFIG[s];
                          return (
                            <button key={s} className="status-update-btn" style={{ color: cfg.color, borderColor: cfg.color + '44' }}
                              onClick={() => handleStatusChange(order.id, s)}>
                              {cfg.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );

  const renderMessages = () => (
    <>
      {messagesLoading ? (
        <div className="admin-loading"><div className="admin-spinner" /><p>Loading messages...</p></div>
      ) : messages.length === 0 ? (
        <div className="admin-empty glass">
          <div className="empty-icon"><MessageSquare size={36} /></div>
          <h3>No messages</h3>
          <p>Customer messages will appear here</p>
        </div>
      ) : (
        <div className="messages-grid">
          {messages.map((msg) => (
            <div className="message-card glass" key={msg.id}>
              <div className="msg-header">
                <div className="msg-sender">
                  <div className="msg-avatar">{msg.name.charAt(0).toUpperCase()}</div>
                  <div>
                    <div className="msg-name">{msg.name}</div>
                    <div className="msg-email">{msg.email}</div>
                  </div>
                </div>
                <button className="btn-action btn-delete" title="Delete message" onClick={() => dispatch(deleteAdminMessage(msg.id))}>
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="msg-subject">{msg.subject}</div>
              <p className="msg-body">{msg.message}</p>
              <div className="msg-date"><Calendar size={12} style={{ marginRight: 4 }} />{formatDate(msg.created_at)}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );

  const renderCustomers = () => (
    <>
      {customersLoading ? (
        <div className="admin-loading"><div className="admin-spinner" /><p>Loading customers...</p></div>
      ) : customers.length === 0 ? (
        <div className="admin-empty glass">
          <div className="empty-icon"><Users size={36} /></div>
          <h3>No customers yet</h3>
          <p>Registered users will appear here</p>
        </div>
      ) : (
        <div className="admin-table-wrapper glass">
          <table className="admin-table">
            <thead><tr><th>Customer</th><th>Email</th><th>Orders</th><th>Total Spent</th><th>Joined</th></tr></thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="item-info">
                      <div className="customer-avatar">{c.name.charAt(0).toUpperCase()}</div>
                      <div><div className="item-name">{c.name}</div><div className="item-desc">{c.role === 'admin' ? '⭐ Admin' : 'Customer'}</div></div>
                    </div>
                  </td>
                  <td><span className="customer-email">{c.email}</span></td>
                  <td><span className="customer-orders">{c.order_count}</span></td>
                  <td><span className="item-price">₦{Number(c.total_spent).toLocaleString()}</span></td>
                  <td><span className="customer-date">{formatDate(c.created_at)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );

  const tabContent = { overview: renderOverview, menu: renderMenu, orders: renderOrders, messages: renderMessages, customers: renderCustomers };

  return (
    <div className="admin-dashboard container">
      {successMessage && <div className="admin-toast success"><CheckCircle size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'text-bottom' }} />{successMessage}</div>}
      {error && <div className="admin-toast error"><AlertTriangle size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'text-bottom' }} />{error}</div>}

      <div className="admin-header">
        <h1><LayoutDashboard size={28} style={{ display: 'inline', marginRight: '0.75rem', verticalAlign: 'text-bottom' }} /><span className="gradient-text">Admin Dashboard</span></h1>
        <p>Manage your restaurant menu, track orders, messages & customers</p>
      </div>

      {/* Tab Navigation */}
      <div className="admin-tabs">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} id={`admin-tab-${id}`} className={`admin-tab ${activeTab === id ? 'active' : ''}`} onClick={() => setActiveTab(id)}>
            <Icon size={17} /><span>{label}</span>
            {id === 'orders' && orders.filter((o) => o.status === 'pending').length > 0 && (
              <span className="tab-badge">{orders.filter((o) => o.status === 'pending').length}</span>
            )}
            {id === 'messages' && messages.length > 0 && (
              <span className="tab-badge">{messages.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="admin-tab-content">
        {tabContent[activeTab]?.()}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal glass" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="gradient-text">{editingItem ? 'Edit Menu Item' : 'Add New Item'}</h2>
              <button className="modal-close" onClick={closeModal}><X size={18} /></button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="item-title">Title</label>
                <input id="item-title" name="title" type="text" placeholder="e.g. Classic Party Jollof" value={formData.title} onChange={handleFormChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="item-description">Description</label>
                <textarea id="item-description" name="description" placeholder="A brief description of the dish..." value={formData.description} onChange={handleFormChange} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="item-price">Price (₦)</label>
                  <input id="item-price" name="price" type="number" min="0" step="any" placeholder="5000" value={formData.price} onChange={handleFormChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="item-category">Category</label>
                  <select id="item-category" name="category" value={formData.category} onChange={handleFormChange} required>
                    {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="item-image">Image URL (optional)</label>
                <input id="item-image" name="image_url" type="url" placeholder="https://example.com/image.jpg" value={formData.image_url} onChange={handleFormChange} />
              </div>
              <button id="submit-menu-item-btn" type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Saving...' : editingItem ? 'Update Item' : 'Add Item'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deleteTarget && (
        <div className="modal-overlay" onClick={closeDeleteModal}>
          <div className="modal glass delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-icon"><AlertTriangle size={30} /></div>
            <h2>Delete Menu Item?</h2>
            <p>Are you sure you want to delete <span className="delete-item-name">{deleteTarget.title}</span>? This action cannot be undone.</p>
            <div className="delete-actions">
              <button className="btn-cancel" onClick={closeDeleteModal}>Cancel</button>
              <button id="confirm-delete-btn" className="btn-confirm-delete" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
