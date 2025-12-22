// التحكم في القائمة الجانبية للهواتف فقط
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
    
    // عناصر الصفحات
    const pageContents = document.querySelectorAll('.page-content');
    const sidebarListItems = document.querySelectorAll('.sidebar-menu li');
    
    if (menuToggle && sidebar) {
        // تبديل القائمة عند النقر على زر القائمة
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('mobile-open');
            
            // تغيير الأيقونة عند فتح/إغلاق القائمة
            const icon = menuToggle.querySelector('i');
            if (sidebar.classList.contains('mobile-open')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                document.body.style.overflow = 'hidden'; // منع التمرير في الخلفية
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                document.body.style.overflow = 'auto'; // إعادة التمرير
            }
        });
        
        // إغلاق القائمة عند النقر خارجها (للشاشات الصغيرة فقط)
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && 
                sidebar.classList.contains('mobile-open') && 
                !sidebar.contains(e.target) && 
                !menuToggle.contains(e.target)) {
                closeMobileMenu();
            }
        });
        
        // إغلاق القائمة عند النقر على رابط (للشاشات الصغيرة فقط)
        sidebarLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    closeMobileMenu();
                }
            });
        });
        
        // إغلاق القائمة عند تغيير حجم النافذة إلى حجم كبير
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && sidebar.classList.contains('mobile-open')) {
                closeMobileMenu();
            }
        });
        
        // وظيفة لإغلاق القائمة
        function closeMobileMenu() {
            sidebar.classList.remove('mobile-open');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            document.body.style.overflow = 'auto';
        }
    }
    
    // تبديل الصفحات عند النقر على عناصر القائمة
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const pageId = this.getAttribute('data-page');
            
            // إزالة النشاط من جميع عناصر القائمة
            sidebarListItems.forEach(item => {
                item.classList.remove('active');
            });
            
            // إضافة النشاط للعنصر الحالي
            this.parentElement.classList.add('active');
            
            // إخفاء جميع الصفحات
            pageContents.forEach(page => {
                page.classList.remove('active');
            });
            
            // إظهار الصفحة المحددة
            const targetPage = document.getElementById(`${pageId}-page`);
            if (targetPage) {
                targetPage.classList.add('active');
                
                // تحديث عنوان الصفحة
                const pageTitle = targetPage.querySelector('.page-title');
                if (pageTitle) {
                    document.title = `لوحة التحكم - ${pageTitle.textContent}`;
                }
            }
            
            // تأثير بسيط عند النقر
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // إضافة تأثيرات لأزرار الإجراءات في الجداول
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // تأثير بسيط عند النقر
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // تحديد نوع الإجراء
            const actionType = this.classList.contains('edit') ? 'تعديل' : 
                              this.classList.contains('details') ? 'تفاصيل' : 'حذف';
            
            // الحصول على الصف الذي يحتوي الزر
            const row = this.closest('tr');
            const userId = row ? row.querySelector('td:first-child').textContent : '';
            
            // عرض رسالة تفاعلية حسب نوع الإجراء
            if (actionType === 'حذف') {
                if (confirm(`هل أنت متأكد من حذف المستخدم ${userId}؟`)) {
                    // هنا يمكن إضافة كود الحذف الحقيقي
                    console.log(`حذف المستخدم: ${userId}`);
                    row.style.opacity = '0.5';
                    setTimeout(() => {
                        row.style.display = 'none';
                        updateUserStats();
                    }, 300);
                }
            } else if (actionType === 'تعديل') {
                console.log(`فتح نموذج تعديل للمستخدم: ${userId}`);
                // هنا يمكن فتح نموذج التعديل
                alert(`فتح نموذج تعديل للمستخدم: ${userId}`);
            } else if (actionType === 'تفاصيل') {
                console.log(`عرض تفاصيل المستخدم: ${userId}`);
                // هنا يمكن عرض تفاصيل المستخدم
                alert(`عرض تفاصيل المستخدم: ${userId}`);
            }
        });
    });
    
    // دالة لتحديث الإحصائيات بعد الحذف
    function updateUserStats() {
        const totalUsers = document.querySelectorAll('#users-table-body tr:not([style*="display: none"])').length;
        const totalUsersElement = document.querySelector('.stat-card:first-child .stat-number');
        
        if (totalUsersElement) {
            totalUsersElement.textContent = totalUsers;
        }
    }
    
    // تهيئة أولية: إظهار صفحة إدارة المستخدمين عند التحميل
    const defaultPage = document.querySelector('.sidebar-menu li.active a');
    if (defaultPage) {
        const pageId = defaultPage.getAttribute('data-page');
        const targetPage = document.getElementById(`${pageId}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
        }
    }
});
// أضف هذا الكود إلى ملف script.js

// بيانات تخزين مؤقتة للمستخدمين
let usersData = [
    { id: '#U001', name: 'أحمد محمد', phone: '+966 50 123 4567', type: 'admin', status: 'active' }
];

// متغير لتتبع حالة التعديل
let isEditing = false;
let editingUserId = null;

// تفعيل زر الإضافة
document.addEventListener('DOMContentLoaded', () => {
    // ... الكود الحالي ...
    
    // تفعيل زر الإضافة
    const addButton = document.querySelector('.tool-btn .fa-user-plus')?.closest('.tool-btn');
    if (addButton) {
        addButton.addEventListener('click', () => {
            openUserModal();
        });
    }
    
    // تفعيل زر التعديل في الجداول
    document.addEventListener('click', (e) => {
        if (e.target.closest('.action-btn.edit')) {
            const row = e.target.closest('tr');
            const userId = row.querySelector('td:first-child').textContent;
            openUserModalForEdit(userId);
        }
    });
    
    // تفعيل النموذج
    const modal = document.getElementById('userModal');
    const closeBtn = document.querySelector('.close');
    const userForm = document.getElementById('userForm');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    // إغلاق النموذج عند النقر خارج المحتوى
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // معالجة تقديم النموذج
    if (userForm) {
        userForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveUser();
        });
    }
    
    // تهيئة عرض المستخدمين
    renderUsersTable();
});

// فتح نموذج إضافة مستخدم
function openUserModal() {
    isEditing = false;
    editingUserId = null;
    
    const modal = document.getElementById('userModal');
    const modalTitle = document.getElementById('modalTitle');
    const userForm = document.getElementById('userForm');
    
    modalTitle.textContent = 'إضافة مستخدم جديد';
    userForm.reset();
    
    modal.style.display = 'block';
}

// فتح نموذج تعديل مستخدم
function openUserModalForEdit(userId) {
    isEditing = true;
    editingUserId = userId;
    
    const user = usersData.find(u => u.id === userId);
    if (!user) return;
    
    const modal = document.getElementById('userModal');
    const modalTitle = document.getElementById('modalTitle');
    const userName = document.getElementById('userName');
    const userPhone = document.getElementById('userPhone');
    const userType = document.getElementById('userType');
    const userStatus = document.getElementById('userStatus');
    
    modalTitle.textContent = 'تعديل بيانات المستخدم';
    userName.value = user.name;
    userPhone.value = user.phone;
    userType.value = user.type;
    userStatus.value = user.status;
    
    modal.style.display = 'block';
}

// حفظ المستخدم
function saveUser() {
    const userName = document.getElementById('userName').value;
    const userPhone = document.getElementById('userPhone').value;
    const userType = document.getElementById('userType').value;
    const userStatus = document.getElementById('userStatus').value;
    
    if (isEditing) {
        // تحديث المستخدم الموجود
        const userIndex = usersData.findIndex(u => u.id === editingUserId);
        if (userIndex !== -1) {
            usersData[userIndex] = {
                ...usersData[userIndex],
                name: userName,
                phone: userPhone,
                type: userType,
                status: userStatus
            };
        }
    } else {
        // إضافة مستخدم جديد
        const newUserId = generateUserId();
        usersData.push({
            id: newUserId,
            name: userName,
            phone: userPhone,
            type: userType,
            status: userStatus
        });
    }
    
    // إغلاق النموذج
    document.getElementById('userModal').style.display = 'none';
    
    // تحديث الجدول والإحصائيات
    renderUsersTable();
    updateUserStats();
    
    // إظهار رسالة تأكيد
    alert(isEditing ? 'تم تحديث بيانات المستخدم بنجاح!' : 'تم إضافة المستخدم الجديد بنجاح!');
}

// توليد معرف مستخدم جديد
function generateUserId() {
    const lastId = usersData.length > 0 ? 
        parseInt(usersData[usersData.length - 1].id.replace('#U', '')) : 0;
    return `#U${(lastId + 1).toString().padStart(3, '0')}`;
}

// عرض المستخدمين في الجدول
function renderUsersTable() {
    const tableBody = document.getElementById('users-table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    usersData.forEach(user => {
        // تحويل نوع المستخدم إلى نص للعرض
        let userTypeText = '';
        let userTypeClass = '';
        if (user.type === 'admin') {
            userTypeText = 'مشرف';
            userTypeClass = 'admin';
        } else if (user.type === 'manager') {
            userTypeText = 'مدير';
            userTypeClass = 'manager';
        } else {
            userTypeText = 'مستخدم عادي';
            userTypeClass = 'user';
        }
        
        // تحويل الحالة إلى نص
        let statusText = '';
        let statusClass = '';
        if (user.status === 'active') {
            statusText = 'نشط';
            statusClass = 'active';
        } else if (user.status === 'inactive') {
            statusText = 'غير نشط';
            statusClass = 'inactive';
        } else {
            statusText = 'محظور';
            statusClass = 'banned';
        }
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.phone}</td>
            <td><span class="user-type ${userTypeClass}">${userTypeText}</span></td>
            <td><span class="user-status ${statusClass}">${statusText}</span></td>
            <td class="actions-cell">
                <button class="action-btn edit"><i class="fas fa-edit"></i> تعديل</button>
                <button class="action-btn details"><i class="fas fa-eye"></i> تفاصيل</button>
                <button class="action-btn delete"><i class="fas fa-trash"></i> حذف</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // إعادة ربط أحداث الحذف للصفوف الجديدة
    attachDeleteEvents();
}

// تحديث الإحصائيات
function updateUserStats() {
    const totalUsers = usersData.length;
    const activeUsers = usersData.filter(u => u.status === 'active').length;
    const admins = usersData.filter(u => u.type === 'admin').length;
    const managers = usersData.filter(u => u.type === 'manager').length;
    const bannedUsers = usersData.filter(u => u.status === 'banned').length;
    const newUsers = usersData.filter(u => u.id.includes('#U0')).length; // بسيط لأغراض العرض
    
    // تحديث البطاقات الإحصائية
    const statCards = document.querySelectorAll('#stats-grid .stat-card');
    if (statCards.length >= 6) {
        statCards[0].querySelector('.stat-number').textContent = totalUsers;
        statCards[1].querySelector('.stat-number').textContent = activeUsers;
        statCards[2].querySelector('.stat-number').textContent = admins;
        statCards[3].querySelector('.stat-number').textContent = managers;
        statCards[4].querySelector('.stat-number').textContent = newUsers;
        statCards[5].querySelector('.stat-number').textContent = bannedUsers;
    }
}

// إعادة ربط أحداث الحذف
function attachDeleteEvents() {
    const deleteButtons = document.querySelectorAll('.action-btn.delete');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const userId = row.querySelector('td:first-child').textContent;
            
            if (confirm(`هل أنت متأكد من حذف المستخدم ${userId}؟`)) {
                // حذف من البيانات
                usersData = usersData.filter(u => u.id !== userId);
                
                // إزالة من العرض
                row.style.opacity = '0.5';
                setTimeout(() => {
                    row.style.display = 'none';
                    updateUserStats();
                }, 300);
            }
        });
    });
}