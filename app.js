// ==================== App State ====================
let dishes = [];
let currentDish = null;
let editingDishId = null;
let schedule = {};
let currentWeekStart = getMonday(new Date());

// ==================== DOM Elements ====================
const pages = {
    home: document.getElementById('home-page'),
    dishes: document.getElementById('dishes-page'),
    schedule: document.getElementById('schedule-page'),
    info: document.getElementById('info-page')
};

const scheduleGrid = document.getElementById('schedule-grid');
const currentWeekLabel = document.getElementById('current-week-label');
const prevWeekBtn = document.getElementById('prev-week-btn');
const nextWeekBtn = document.getElementById('next-week-btn');

const rollWeekBtn = document.getElementById('roll-week-btn');
const clearScheduleBtn = document.getElementById('clear-schedule-btn');
const diceOverlay = document.getElementById('dice-overlay');

const navLinks = document.querySelectorAll('.nav-link');
const dice = document.getElementById('dice');
const resultContainer = document.getElementById('result-container');
const emptyState = document.getElementById('empty-state');
const dishNameDisplay = document.getElementById('dish-name');
const viewRecipeBtn = document.getElementById('view-recipe-btn');
const viewInfoBtn = document.getElementById('view-info-btn');
const addDishBtn = document.getElementById('add-dish-btn');
const dishesGrid = document.getElementById('dishes-grid');
const noDishes = document.getElementById('no-dishes');
const thinkingText = document.getElementById('thinking-text');

// Modals
const modal = document.getElementById('modal');
const dishModal = document.getElementById('dish-modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const detailModal = document.getElementById('detail-modal');
const detailModalTitle = document.getElementById('detail-modal-title');
const detailModalBody = document.getElementById('detail-modal-body');
const dishModalTitle = document.getElementById('dish-modal-title');
const dishForm = document.getElementById('dish-form');
const dishNameInput = document.getElementById('dish-name-input');
const dishRecipeInput = document.getElementById('dish-recipe-input');
const dishInfoInput = document.getElementById('dish-info-input');

// ==================== Initialization ====================
document.addEventListener('DOMContentLoaded', () => {
    loadDishes();
    loadSchedule();
    setupEventListeners();
    renderDishesPage();
    renderSchedulePage();
});

// ==================== Local Storage Functions ====================
function loadDishes() {
    const stored = localStorage.getItem('foodRandomizerDishes');
    if (stored) {
        dishes = JSON.parse(stored);
    } else {
        // Initialize with default dishes
        dishes = getDefaultDishes();
        saveDishes();
    }
}

function loadSchedule() {
    const stored = localStorage.getItem('foodRandomizerSchedule');
    if (stored) {
        schedule = JSON.parse(stored);
    }
}

function saveSchedule() {
    localStorage.setItem('foodRandomizerSchedule', JSON.stringify(schedule));
}

function getDefaultDishes() {
    return [
        {
            id: '1',
            name: 'Trứng Chiên Thịt Bằm',
            recipe: 'Chuẩn bị: Cho 3 quả trứng, 100g thịt băm, hành lá cắt nhỏ vào bát.\n\nNêm gia vị: Thêm 1 thìa cà phê nước mắm, 1/2 thìa hạt nêm và một ít tiêu xay. Đánh đều tay.\n\nChiên trứng: Làm nóng chảo với dầu ăn, đổ hỗn hợp trứng vào.\n\nHoàn thiện: Chiên lửa nhỏ cho đến khi vàng mặt dưới, lật mặt hoặc cuộn lại cho đến khi chín đều cả hai mặt.',
            info: 'Món ăn quốc dân cực kỳ đưa cơm, vị béo của trứng hòa quyện với thịt băm đậm đà và hành lá thơm nồng.',
            createdAt: new Date().toISOString()
        },
        {
            id: '2',
            name: 'Đậu Hũ Sốt Cà Chua',
            recipe: 'Sơ chế: Đậu hũ cắt khối vuông nhỏ. Cà chua (2 quả) băm nhuyễn.\n\nChiên đậu: Chiên đậu hũ vàng đều các mặt rồi vớt ra để ráo dầu.\n\nLàm sốt: Phi thơm hành tím, cho cà chua vào xào nhừ với một ít nước. Nêm mắm, đường, hạt nêm cho vừa vị chua ngọt.\n\nRim đậu: Cho đậu đã chiên vào chảo sốt, đảo nhẹ tay và rim lửa nhỏ khoảng 5 phút để thấm vị. Rắc thêm hành lá.',
            info: 'Những miếng đậu hũ chiên vàng giòn bên ngoài, mềm mượt bên trong thấm đẫm sốt cà chua chua ngọt bắt mắt.',
            createdAt: new Date().toISOString()
        },
        {
            id: '3',
            name: 'Canh Rau Ngót Thịt Bằm',
            recipe: 'Sơ chế: Rau ngót tuốt lá, rửa sạch và vò sơ cho hơi nát (giúp canh ngọt hơn). Thịt heo bằm ướp tí gia vị.\n\nXào thịt: Phi thơm hành khô, cho thịt bằm vào xào săn.\n\nNấu canh: Đổ lượng nước vừa đủ vào nồi đun sôi. Khi nước sôi, cho rau ngót vào.\n\nNêm nếm: Chờ nước sôi lại lần nữa, nêm gia vị vừa ăn rồi tắt bếp ngay để rau giữ được màu xanh.',
            info: 'Bát canh xanh mát, thanh nhiệt cơ thể, là sự kết hợp hoàn hảo giữa vị ngọt của thịt và vị thanh của lá rau ngót.',
            createdAt: new Date().toISOString()
        },
        {
            id: '4',
            name: 'Gà Kho Sả Ớt',
            recipe: 'Ướp gà: Thịt gà chặt miếng vừa ăn, ướp với sả băm, ớt, nước mắm, đường, và một ít nước màu trong 20 phút.\n\nXào săn: Phi thơm sả băm còn lại với dầu ăn, cho gà đã ướp vào xào ở lửa lớn cho thịt săn lại.\n\nKho gà: Thêm một chút nước vào xâm xấp mặt thịt, hạ lửa nhỏ.\n\nHoàn thiện: Kho đến khi nước cạn bớt, sền sệt và bám đều vào miếng gà thì tắt bếp.',
            info: 'Miếng thịt gà săn chắc, thơm lừng mùi sả phi và vị cay nồng của ớt, cực kỳ thích hợp cho những ngày thời tiết se lạnh.',
            createdAt: new Date().toISOString()
        },
        {
            id: '5',
            name: 'Rau Muống Xào Tỏi',
            recipe: 'Chuẩn bị: Rau muống nhặt sạch, bỏ bớt lá nếu thích ăn giòn. Tỏi đập dập.\n\nChần rau: Đun nước sôi với một chút muối, cho rau vào chần nhanh 30 giây rồi vớt ra ngâm nước lạnh.\n\nXào rau: Phi thơm tỏi với dầu ăn. Đổ rau muống vào xào nhanh tay trên lửa lớn.\n\nNêm vị: Thêm hạt nêm, đường hoặc một ít dầu hào. Đảo nhanh tay khoảng 1 phút rồi bày ra đĩa.',
            info: 'Món rau xanh mướt, giữ được độ giòn sần sật và dậy mùi thơm đặc trưng của tỏi phi vàng rộm.',
            createdAt: new Date().toISOString()
        },
        {
            id: '6',
            name: 'Thịt Kho Tàu (Thịt Kho Trứng)',
            recipe: 'Sơ chế: Thịt ba chỉ cắt miếng vuông to. Trứng vịt luộc chín, bóc vỏ.\n\nƯớp thịt: Ướp thịt với mắm, đường, hành băm, tiêu và nước màu khoảng 30 phút.\n\nNấu thịt: Cho thịt vào nồi đảo săn. Đổ nước dừa (hoặc nước lọc) vào ngập mặt thịt, đun sôi rồi hạ lửa nhỏ.\n\nRim trứng: Khi thịt bắt đầu mềm, cho trứng luộc vào kho cùng. Đun đến khi nước rút bớt và thịt mềm rục là đạt.',
            info: 'Món ăn truyền thống đậm đà với miếng thịt ba chỉ mềm tan màu cánh gián quyện cùng trứng vịt bùi bùi.',
            createdAt: new Date().toISOString()
        },
        {
            id: '7',
            name: 'Tôm Rim Mặn Ngọt',
            recipe: 'Sơ chế: Tôm cắt bỏ râu và đuôi, rửa sạch, để ráo.\n\nXào tôm: Phi thơm tỏi, cho tôm vào xào cho đến khi tôm chuyển sang màu đỏ.\n\nPha sốt: Trộn hỗn hợp gồm nước mắm, đường, tiêu theo tỷ lệ 2 mắm : 1 đường.\n\nRim tôm: Đổ sốt vào chảo tôm, để lửa nhỏ rim đến khi nước sốt keo lại, bám một lớp mỏng bóng loáng quanh con tôm.',
            info: 'Tôm tươi có lớp vỏ đỏ au, bóng bẩy nhờ lớp nước sốt mặn mặn ngọt ngọt cực kỳ bắt cơm.',
            createdAt: new Date().toISOString()
        },
        {
            id: '8',
            name: 'Cá Thu Nhật Kho Cà Chua',
            recipe: 'Sơ chế: Cá rửa sạch với nước muối, cắt khúc. Cà chua thái múi cau.\n\nChiên cá: Chiên sơ hai mặt cá cho thịt săn và vàng nhẹ.\n\nLàm sốt: Xào cà chua cho nhừ, thêm một ít nước, mắm, đường.\n\nKho cá: Cho cá vào nồi sốt cà chua, đậy vung rim lửa nhỏ khoảng 15 phút cho cá thấm gia vị. Rắc thêm tiêu và hành lá.',
            info: 'Cá thu giàu dinh dưỡng hòa quyện cùng sốt cà chua giúp khử mùi tanh, tạo nên hương vị đậm đà hấp dẫn.',
            createdAt: new Date().toISOString()
        },
        {
            id: '9',
            name: 'Bò Xào Thiên Lý',
            recipe: 'Ướp thịt: Thịt bò thái lát mỏng, ướp với tỏi băm, dầu hào và tiêu.\n\nXào bò: Làm nóng chảo với lửa lớn, cho bò vào xào nhanh tay vừa chín tái thì trút ra đĩa riêng.\n\nXào rau: Tiếp tục dùng chảo đó, phi thêm tỏi và cho hoa thiên lý vào xào. Thêm một chút nước để rau nhanh chín.\n\nKết hợp: Khi rau vừa chín tới, đổ thịt bò vào đảo lại thật nhanh rồi tắt bếp ngay để thịt không bị dai.',
            info: 'Sự kết hợp tinh tế giữa thịt bò mềm ngọt và hoa thiên lý giòn thơm, món ăn vừa ngon vừa có tác dụng an thần.',
            createdAt: new Date().toISOString()
        },
        {
            id: '10',
            name: 'Canh Chua Cá Lóc',
            recipe: 'Chuẩn bị: Cá lóc làm sạch, cắt khúc. Chuẩn bị thơm, cà chua, đậu bắp, bạc hà, giá đỗ.\n\nNấu nước dùng: Đun sôi nước với nước cốt me. Cho cá vào nấu chín rồi vớt ra để riêng.\n\nNấu rau: Cho thơm và cà chua vào trước, sau đó đến đậu bắp, bạc hà và giá đỗ.\n\nHoàn thiện: Nêm mắm, đường cho vừa vị chua ngọt. Cho cá lại vào nồi, rắc ngò gai, rau ngổ lên trên.',
            info: 'Đặc sản mang hương vị miền Nam với nước canh chua thanh từ me, vị ngọt từ cá lóc và mùi thơm thảo mộc.',
            createdAt: new Date().toISOString()
        },
        {
            id: '11',
            name: 'Trứng Chưng Thịt (Mắm Chưng)',
            recipe: 'Trộn hỗn hợp: Cho thịt băm, mắm cá băm nhuyễn, 2 quả trứng (chừa lại 1 lòng đỏ), hành tím băm và nhiều tiêu vào tô.\n\nĐánh đều: Trộn thật đều hỗn hợp cho đến khi kết dính.\n\nHấp: Cho tô vào xửng hấp cách thủy khoảng 20-25 phút.\n\nTạo màu: Đánh tan lòng đỏ trứng còn lại, phết lên mặt tô mắm, hấp thêm 5 phút không đậy nắp cho đẹp.',
            info: 'Món ăn đậm đà, dân dã, thường được dùng kèm với dưa leo và các loại rau sống để tăng thêm hương vị.',
            createdAt: new Date().toISOString()
        },
        {
            id: '12',
            name: 'Sườn Non Ram Mặn',
            recipe: 'Sơ chế: Sườn non chặt miếng nhỏ, chần qua nước sôi để khử mùi.\n\nChiên sườn: Cho sườn vào chảo chiên cho đến khi cháy cạnh vàng đều.\n\nPha nước rim: Hòa tan nước mắm, đường, tỏi băm, ớt băm và một ít nước lọc.\n\nRam sườn: Đổ hỗn hợp nước sốt vào sườn, đảo đều trên lửa nhỏ cho đến khi nước cạn, bám màu cánh gián.',
            info: 'Những miếng sườn nhỏ xinh được ram vàng óng, thấm vị mặn mòi của nước mắm tỏi ớt, rất tốn cơm.',
            createdAt: new Date().toISOString()
        },
        {
            id: '13',
            name: 'Mướp Đắng (Khổ Qua) Xào Trứng',
            recipe: 'Sơ chế: Khổ qua bỏ ruột, thái lát mỏng. Ngâm nước muối loãng rồi vớt ra để ráo.\n\nXào mướp: Phi thơm hành, cho khổ qua vào xào trên lửa lớn cho đến khi chín tái.\n\nThêm trứng: Đánh tan 2 quả trứng với một chút hạt nêm, đổ vào chảo khổ qua.\n\nHoàn thiện: Đảo nhanh tay để trứng bám đều vào khổ qua cho đến khi trứng khô lại là hoàn tất.',
            info: 'Vị đắng đặc trưng của khổ qua được làm dịu đi bởi vị béo ngậy của trứng, là món ăn cực tốt cho sức khỏe.',
            createdAt: new Date().toISOString()
        },
        {
            id: '14',
            name: 'Nộm (Gỏi) Đu Đủ Tai Heo',
            recipe: 'Sơ chế: Tai heo luộc chín, thái mỏng. Đu đủ và cà rốt bào sợi, bóp qua với chút muối rồi rửa sạch.\n\nPha nước trộn: Pha nước mắm, đường, nước cốt chanh, tỏi và ớt băm.\n\nTrộn gỏi: Cho tai heo, đu đủ vào tô lớn, rưới nước mắm vào trộn đều.\n\nHoàn thiện: Thêm rau thơm và lạc rang giã dập vào trộn nhẹ trước khi ăn.',
            info: 'Món gỏi giòn sần sật từ tai heo quyện cùng đu đủ xanh, vị chua cay mặn ngọt cực kỳ kích thích vị giác.',
            createdAt: new Date().toISOString()
        },
        {
            id: '15',
            name: 'Canh Khoai Mỡ Thịt Bằm',
            recipe: 'Sơ chế: Khoai mỡ gọt vỏ, dùng muỗng nạo nhỏ hoặc băm nhuyễn để canh có độ dẻo.\n\nNấu thịt: Phi hành tím, xào thịt bằm cho săn lại, sau đó đổ nước vào đun sôi.\n\nNấu khoai: Khi nước sôi, cho khoai mỡ vào khuấy đều.\n\nHoàn thiện: Đợi canh sôi lại và khoai chín trong, nêm gia vị vừa ăn rồi rắc ngò gai, rau ngổ.',
            info: 'Bát canh có màu tím bắt mắt, độ dẻo thơm của khoai mỡ kết hợp thịt băm tạo nên hương vị khó quên.',
            createdAt: new Date().toISOString()
        },
        {
            id: '16',
            name: 'Mực Xào Cần Tỏi',
            recipe: 'Sơ chế: Mực làm sạch, thái miếng. Cần tây, tỏi tây cắt khúc.\n\nXào mực: Phi tỏi thơm, cho mực vào xào với lửa thật lớn để mực không bị ra nước.\n\nXào rau: Khi mực vừa chín tới, cho cần tây, tỏi tây và hành tây vào đảo cùng.\n\nHoàn thiện: Nêm thêm dầu hào, tiêu xay, đảo nhanh 30 giây rồi tắt bếp.',
            info: 'Mực tươi trắng giòn, không bị tanh nhờ sự kết hợp với cần tây và tỏi tây, món ăn sang trọng cho bữa cơm.',
            createdAt: new Date().toISOString()
        },
        {
            id: '17',
            name: 'Đậu Cô Ve Xào Lòng Gà',
            recipe: 'Sơ chế: Lòng gà làm sạch, thái miếng vừa ăn. Đậu cô ve tước xơ, cắt xéo.\n\nXào lòng: Phi thơm hành khô, cho lòng gà vào xào chín với một ít gia vị rồi trút ra bát.\n\nXào đậu: Cho đậu cô ve vào chảo xào, thêm một chút nước để đậu chín xanh đều.\n\nKết hợp: Đậu gần chín thì cho lòng gà vào đảo cùng, nêm nếm lại cho vừa miệng.',
            info: 'Món xào giản dị nhưng giàu dinh dưỡng với lòng gà dai dai và đậu cô ve ngọt lịm, xanh mướt.',
            createdAt: new Date().toISOString()
        },
        {
            id: '18',
            name: 'Cá Rô Phi Chiên Xù',
            recipe: 'Chuẩn bị: Cá rô phi làm sạch, thấm thật khô nước trên mặt cá.\n\nTẩm bột: Lăn cá qua một lớp bột chiên giòn mỏng.\n\nChiên cá: Đun dầu thật nóng, cho cá vào chiên ở lửa vừa cho đến khi vàng đều một mặt mới lật.\n\nHoàn thiện: Chiên đến khi cá chín vàng ruộm hai mặt thì vớt ra thấm dầu.',
            info: 'Miếng cá rô phi giòn rụm bên ngoài, thịt bên trong trắng ngần và ngọt lịm, chấm cùng mắm gừng cay nồng.',
            createdAt: new Date().toISOString()
        },
        {
            id: '19',
            name: 'Bắp Cải Cuộn Thịt Hấp',
            recipe: 'Làm nhân: Trộn thịt băm, mộc nhĩ, hành tím, gia vị và tiêu cho thấm.\n\nChuẩn bị lá: Lá bắp cải chần qua nước sôi cho mềm rồi ngâm nước lạnh.\n\nCuộn thịt: Đặt nhân thịt vào lá bắp cải, cuộn lại giống như cuốn nem.\n\nHấp: Xếp các cuộn bắp cải vào đĩa, đem hấp cách thủy khoảng 15-20 phút.',
            info: 'Món ăn thanh đạm, bắt mắt với lá bắp cải ngọt lịm bao bọc lấy nhân thịt băm mộc nhĩ đậm đà bên trong.',
            createdAt: new Date().toISOString()
        },
        {
            id: '20',
            name: 'Canh Bí Đỏ Nấu Tôm',
            recipe: 'Sơ chế: Bí đỏ gọt vỏ, cắt miếng vuông. Tôm bóc vỏ, băm nhỏ.\n\nXào tôm: Phi thơm hành, cho tôm vào xào sơ cho đến khi chuyển màu hồng.\n\nNấu canh: Đổ nước vào nồi đun sôi, sau đó cho bí đỏ vào hầm.\n\nHoàn thiện: Khi bí đã mềm, nêm gia vị vừa ăn rồi rắc hành lá, ngò rí.',
            info: 'Món canh bổ dưỡng, có vị ngọt bùi từ bí đỏ và vị ngọt thanh tự nhiên từ tôm tươi, rất tốt cho sức khỏe.',
            createdAt: new Date().toISOString()
        },
        {
            id: '21',
            name: 'Ba Chỉ Rang Cháy Cạnh',
            recipe: 'Áp chảo thịt: Thịt ba chỉ thái miếng mỏng, cho vào chảo rang đến khi thịt tiết mỡ và sém vàng các cạnh.\n\nChắt mỡ: Chắt bớt mỡ thừa ra ngoài, chỉ để lại một ít trong chảo.\n\nNêm gia vị: Cho hành tím băm, nước mắm, đường và một ít nước màu vào đảo đều.\n\nHoàn thiện: Đảo đến khi sốt keo lại bám đều vào thịt, rắc thêm nhiều hành lá và tiêu.',
            info: 'Miếng thịt heo béo ngậy, được rang cháy cạnh thơm lừng quyện cùng sốt mắm đường đậm đà.',
            createdAt: new Date().toISOString()
        },
        {
            id: '22',
            name: 'Canh Cà Chua Trứng (Canh Mây)',
            recipe: 'Xào cà chua: Phi thơm hành, cho cà chua thái múi cau vào xào mềm với chút muối.\n\nNấu nước: Đổ nước vào nồi đun sôi.\n\nTạo vân trứng: Đánh tan 2 quả trứng. Khi nước sôi mạnh, vừa đổ trứng từ từ vào vừa khuấy nhẹ theo một chiều để tạo vân.\n\nHoàn thiện: Nêm gia vị, cho hành lá, ngò rí vào rồi tắt bếp ngay.',
            info: 'Món canh siêu nhanh cho người bận rộn, màu sắc rực rỡ và vị chua thanh rất dễ ăn.',
            createdAt: new Date().toISOString()
        },
        {
            id: '23',
            name: 'Nấm Đùi Gà Kho Tiêu',
            recipe: 'Sơ chế: Nấm đùi gà rửa sạch, cắt miếng vừa ăn hoặc thái lát.\n\nƯớp nấm: Ướp nấm với nước tương, hắc xì dầu, đường và thật nhiều tiêu xay trong 10 phút.\n\nKho nấm: Phi thơm hành tím, cho nấm vào đảo săn.\n\nHoàn thiện: Thêm chút nước lọc, kho lửa nhỏ đến khi nước sốt cạn sệt và nấm có màu nâu đẹp mắt.',
            info: 'Món chay đậm đà, nấm đùi gà dai giòn thấm vị tiêu cay nồng, ăn kèm cơm trắng rất hợp.',
            createdAt: new Date().toISOString()
        },
        {
            id: '24',
            name: 'Gan Heo Xào Hành Tây',
            recipe: 'Sơ chế: Gan thái mỏng, ngâm sữa tươi 15 phút để khử độc và mùi tanh, sau đó rửa sạch, ướp gia vị.\n\nXào gan: Phi tỏi thơm, cho gan vào xào với lửa lớn cho đến khi gan vừa chín tái thì trút ra đĩa.\n\nXào rau: Cho hành tây thái múi cau vào xào chín.\n\nHoàn thiện: Đổ gan lại vào chảo, đảo nhanh tay, rắc thêm hành lá và tiêu rồi tắt bếp.',
            info: 'Gan heo bùi béo kết hợp với hành tây ngọt thanh, là món ăn giàu sắt và bổ dưỡng.',
            createdAt: new Date().toISOString()
        },
        {
            id: '25',
            name: 'Canh Khoai Tây Cà Rốt Sườn Non',
            recipe: 'Hầm sườn: Sườn non chần qua nước sôi, sau đó cho vào nồi hầm với nước khoảng 20 phút.\n\nNấu rau củ: Cho cà rốt vào hầm trước 5 phút, sau đó cho khoai tây vào.\n\nNêm nếm: Hầm đến khi rau củ mềm nhừ, nêm gia vị vừa ăn.\n\nHoàn thiện: Rắc hành lá và ngò rí để canh thêm thơm và đẹp mắt.',
            info: 'Món canh hầm quen thuộc, nước canh ngọt lịm từ xương, khoai tây và cà rốt bở tơi.',
            createdAt: new Date().toISOString()
        },
        {
            id: '26',
            name: 'Cá Linh Kho Lạt (Kho Nghệ)',
            recipe: 'Ướp cá: Cá linh làm sạch, ướp với nghệ băm, nước mắm, đường và tiêu.\n\nKho cá: Cho cá vào nồi, thêm nước dừa tươi hoặc nước lọc xâm xấp mặt cá.\n\nRim cá: Đun lửa nhỏ cho đến khi nước cạn bớt nhưng vẫn còn hơi lỏng (kho lạt).\n\nHoàn thiện: Thêm vài lát ớt và hành lá. Ăn kèm với rau sống, bông điên điển là tuyệt nhất.',
            info: 'Món cá đặc trưng mùa nước nổi miền Tây, cá linh ngọt thịt kho cùng nghệ tươi thơm nồng.',
            createdAt: new Date().toISOString()
        },
        {
            id: '27',
            name: 'Đậu Hũ Nhồi Thịt Sốt Cà',
            recipe: 'Làm nhân: Trộn thịt băm với mộc nhĩ, hành tím và gia vị.\n\nNhồi thịt: Rạch nhẹ miếng đậu hũ, nhồi nhân thịt vào giữa. Chiên vàng mặt thịt trước rồi chiên các mặt còn lại.\n\nLàm sốt: Xào cà chua nhừ, nêm gia vị chua ngọt.\n\nRim đậu: Cho đậu vào nồi sốt, rim lửa nhỏ 10 phút để thịt chín hoàn toàn và thấm sốt.',
            info: 'Đậu hũ mềm béo nhồi nhân thịt đậm đà, quyện trong sốt cà chua đỏ rực, hấp dẫn cả người lớn và trẻ nhỏ.',
            createdAt: new Date().toISOString()
        },
        {
            id: '28',
            name: 'Thịt Bò Xào Cần Tây Hành Tây',
            recipe: 'Ướp bò: Bò thái mỏng, ướp tỏi, dầu ăn, dầu hào để thịt mềm.\n\nXào bò: Xào bò lửa thật lớn cho vừa chín tới rồi trút ra đĩa ngay.\n\nXào rau: Cho hành tây và cần tây vào chảo xào nhanh tay.\n\nHoàn thiện: Đổ bò vào trộn đều, nêm lại gia vị và tiêu xay.',
            info: 'Thịt bò mềm, không bị dai, thơm phức mùi cần tây và tỏi phi, món xào bổ sung nhiều đạm.',
            createdAt: new Date().toISOString()
        },
        {
            id: '29',
            name: 'Canh Bí Xanh Nấu Tôm Khô',
            recipe: 'Sơ chế: Bí xanh gọt vỏ, thái miếng vừa ăn. Tôm khô ngâm nước cho mềm, giã nhẹ.\n\nXào tôm: Phi hành, xào tôm khô cho thơm.\n\nNấu canh: Đổ nước vào đun sôi, cho bí xanh vào nấu.\n\nHoàn thiện: Khi bí vừa chín (vẫn còn độ giòn), nêm gia vị và hành lá.',
            info: 'Món canh thanh mát, giải nhiệt mùa hè cực tốt với vị ngọt dịu của bí xanh và tôm khô.',
            createdAt: new Date().toISOString()
        },
        {
            id: '30',
            name: 'Măng Tây Xào Tỏi',
            recipe: 'Sơ chế: Măng tây cắt bỏ phần gốc già, rửa sạch, cắt khúc. Tỏi băm nhỏ.\n\nChần măng: Chần măng qua nước sôi muối khoảng 1 phút rồi ngâm nước đá để giữ màu xanh.\n\nXào măng: Phi thơm thật nhiều tỏi, cho măng tây vào xào nhanh tay ở lửa lớn.\n\nHoàn thiện: Nêm hạt nêm và một ít dầu hào cho bóng bẩy rồi bày ra đĩa.',
            info: 'Món ăn hiện đại, giàu chất xơ, măng tây xanh mướt, giòn sần sật và thơm mùi tỏi đặc trưng.',
            createdAt: new Date().toISOString()
        }
    ];
}

function saveDishes() {
    localStorage.setItem('foodRandomizerDishes', JSON.stringify(dishes));
}

// ==================== Event Listeners Setup ====================
function setupEventListeners() {
    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageName = link.dataset.page;
            switchPage(pageName);
        });
    });

    // Logo click to go home
    const logoLink = document.querySelector('.logo-link');
    if (logoLink) {
        logoLink.addEventListener('click', (e) => {
            e.preventDefault();
            switchPage('home');
        });
    }

    // Dice rolling
    dice.addEventListener('click', rollDice);

    // Result buttons
    viewRecipeBtn.addEventListener('click', () => showDishDetails('recipe'));
    viewInfoBtn.addEventListener('click', () => showDishDetails('info'));

    // Add dish button
    addDishBtn.addEventListener('click', () => openDishModal());

    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            const m = btn.closest('.modal');
            if (m) closeModal(m);
        });
    });

    // Modal overlay clicks
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', () => {
            const m = overlay.closest('.modal');
            if (m) closeModal(m);
        });
    });

    // Cancel button in dish form
    document.querySelectorAll('.cancel-btn').forEach(btn => {
        btn.addEventListener('click', () => closeModal(dishModal));
    });

    // Dish form submission
    // Dish form submission
    dishForm.addEventListener('submit', handleDishFormSubmit);

    // Schedule Navigation
    prevWeekBtn.addEventListener('click', () => changeWeek(-1));
    nextWeekBtn.addEventListener('click', () => changeWeek(1));

    // Schedule Actions
    // Schedule Actions
    rollWeekBtn.addEventListener('click', rollWeekSchedule);
    clearScheduleBtn.addEventListener('click', clearCurrentWeek);
    clearScheduleBtn.addEventListener('click', clearCurrentWeek);
}

// ==================== Page Navigation ====================
function switchPage(pageName) {
    // Update active page
    Object.values(pages).forEach(page => page.classList.remove('active'));
    pages[pageName].classList.add('active');

    // Update active nav link
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === pageName) {
            link.classList.add('active');
        }
    });

    // Reset home page state when leaving
    if (pageName !== 'home') {
        resultContainer.classList.add('hidden');
        emptyState.classList.add('hidden');
    }

    // Refresh dishes page when navigating to it
    if (pageName === 'dishes') {
        renderDishesPage();
    }
}

// ==================== Dice Rolling ====================
function rollDice() {
    // Add rolling animation
    dice.classList.add('rolling');

    // Hide previous results
    resultContainer.classList.add('hidden');
    emptyState.classList.add('hidden');

    // Show thinking text
    thinkingText.classList.remove('hidden');

    // Wait for animation to complete
    setTimeout(() => {
        dice.classList.remove('rolling');

        // Hide thinking text
        thinkingText.classList.add('hidden');

        if (dishes.length === 0) {
            // Show empty state
            emptyState.classList.remove('hidden');
        } else {
            // Select random dish
            const randomIndex = Math.floor(Math.random() * dishes.length);
            currentDish = dishes[randomIndex];

            // Display result
            dishNameDisplay.textContent = currentDish.name;
            resultContainer.classList.remove('hidden');
        }
    }, 1000);
}

// ==================== Dish Details Display ====================
function showDishDetails(type) {
    if (!currentDish) return;

    if (type === 'recipe') {
        modalTitle.textContent = `Công thức: ${currentDish.name}`;
        modalBody.textContent = currentDish.recipe;
    } else if (type === 'info') {
        modalTitle.textContent = `Thông tin: ${currentDish.name}`;
        modalBody.textContent = currentDish.info;
    }

    openModal(modal);
}

// ==================== Dish Management ====================
function openDishModal(dish = null) {
    editingDishId = dish ? dish.id : null;

    if (dish) {
        dishModalTitle.textContent = 'Chỉnh sửa món ăn';
        dishNameInput.value = dish.name;
        dishRecipeInput.value = dish.recipe;
        dishInfoInput.value = dish.info;
    } else {
        dishModalTitle.textContent = 'Thêm món ăn';
        dishForm.reset();
    }

    openModal(dishModal);
}

function handleDishFormSubmit(e) {
    e.preventDefault();

    const dishData = {
        name: dishNameInput.value.trim(),
        recipe: dishRecipeInput.value.trim(),
        info: dishInfoInput.value.trim()
    };

    if (editingDishId) {
        // Update existing dish
        const index = dishes.findIndex(d => d.id === editingDishId);
        if (index !== -1) {
            dishes[index] = { ...dishes[index], ...dishData };
        }
    } else {
        // Create new dish
        const newDish = {
            id: Date.now().toString(),
            ...dishData,
            createdAt: new Date().toISOString()
        };
        dishes.push(newDish);
    }

    saveDishes();
    renderDishesPage();
    closeModal(dishModal);
    dishForm.reset();
}

function deleteDish(id) {
    if (confirm('Bạn có chắc chắn muốn xóa món ăn này?')) {
        dishes = dishes.filter(d => d.id !== id);
        saveDishes();
        renderDishesPage();
    }
}

function viewDish(dish) {
    detailModalTitle.textContent = dish.name;
    detailModalBody.innerHTML = `
        <div class="modal-section">
            <h4 style="color: var(--primary); margin-bottom: 0.25rem; margin-top: 0;">Công thức:</h4>
            <p style="white-space: pre-wrap; margin: 0;">${dish.recipe}</p>
        </div>
        <div class="modal-section">
            <h4 style="color: var(--accent); margin-bottom: 0.25rem; margin-top: 0;">Thông tin:</h4>
            <p style="white-space: pre-wrap; margin: 0;">${dish.info}</p>
        </div>
    `;
    openModal(detailModal);
}

// ==================== Render Dishes Page ====================
function renderDishesPage() {
    dishesGrid.innerHTML = '';

    if (dishes.length === 0) {
        noDishes.classList.remove('hidden');
        dishesGrid.style.display = 'none';
    } else {
        noDishes.classList.add('hidden');
        dishesGrid.style.display = 'grid';

        dishes.forEach(dish => {
            const card = createDishCard(dish);
            dishesGrid.appendChild(card);
        });
    }
}

function createDishCard(dish) {
    const card = document.createElement('div');
    card.className = 'dish-card';

    const preview = dish.recipe.length > 100
        ? dish.recipe.substring(0, 100) + '...'
        : dish.recipe;

    card.innerHTML = `
        <div class="dish-card-header">
            <h3>${dish.name}</h3>
            <div class="dish-actions">
                <button class="icon-btn edit-btn" title="Chỉnh sửa">✏️</button>
                <button class="icon-btn delete-btn" title="Xóa">🗑️</button>
            </div>
        </div>
        <p class="dish-preview">${preview}</p>
    `;

    // Click on card to view details
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.dish-actions')) {
            viewDish(dish);
        }
    });

    // Edit button
    card.querySelector('.edit-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        openDishModal(dish);
    });

    // Delete button
    card.querySelector('.delete-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        deleteDish(dish.id);
    });

    return card;
}

// ==================== Modal Functions ====================
function openModal(modalElement) {
    modalElement.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalElement) {
    modalElement.classList.add('hidden');
    document.body.style.overflow = '';
}

// ==================== Keyboard Shortcuts ====================
document.addEventListener('keydown', (e) => {
    // Close modals with Escape key
    if (e.key === 'Escape') {
        closeModal(modal);
        closeModal(dishModal);
        closeModal(detailModal);
    }

    // Quick dice roll with Space key (only on home page)
    if (e.key === ' ' && pages.home.classList.contains('active')) {
        e.preventDefault();
        rollDice();
    }
});

// ==================== Utility Functions ====================
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success-gradient)' : 'var(--danger)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius-md);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
// ==================== Schedule Logic ====================
function getMonday(d) {
    d = new Date(d);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    const newDate = new Date(d.setDate(diff));
    newDate.setHours(0, 0, 0, 0);
    return newDate;
}

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

function changeWeek(offset) {
    currentWeekStart.setDate(currentWeekStart.getDate() + (offset * 7));
    renderSchedulePage();
}

function renderSchedulePage() {
    scheduleGrid.innerHTML = '';

    // Update Week Label
    const weekEnd = new Date(currentWeekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    currentWeekLabel.textContent = `${currentWeekStart.toLocaleDateString('vi-VN')} - ${weekEnd.toLocaleDateString('vi-VN')}`;

    // Generate 7 days
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
        const day = new Date(currentWeekStart);
        day.setDate(day.getDate() + i);
        weekDays.push(day);
    }

    weekDays.forEach(day => {
        const dateStr = formatDate(day);
        const dayColumn = document.createElement('div');
        dayColumn.className = 'day-column';

        // Header
        const isToday = formatDate(new Date()) === dateStr;
        const dayHeader = document.createElement('div');
        dayHeader.className = `day-header ${isToday ? 'today' : ''}`;
        dayHeader.innerHTML = `
            <span class="day-name">${day.toLocaleDateString('vi-VN', { weekday: 'long' })}</span>
            <span class="day-date">${day.toLocaleDateString('vi-VN')}</span>
        `;
        dayColumn.appendChild(dayHeader);

        // Meals (Lunch & Dinner)
        ['lunch', 'dinner'].forEach(type => {
            const mealSlot = createMealSlot(dateStr, type);
            dayColumn.appendChild(mealSlot);
        });

        scheduleGrid.appendChild(dayColumn);
    });
}

function createMealSlot(date, type) {
    const slot = document.createElement('div');
    slot.className = 'meal-slot';

    const label = document.createElement('div');
    label.className = 'meal-label';
    label.textContent = type === 'lunch' ? 'Trưa' : 'Tối';
    slot.appendChild(label);

    const mealContent = document.createElement('div');
    mealContent.className = 'meal-content';

    const daySchedule = schedule[date] || {};
    const dishId = daySchedule[type];
    const dish = dishes.find(d => d.id === dishId);

    if (dish) {
        slot.classList.add('filled');
        mealContent.innerHTML = `
            <div class="meal-name" title="${dish.name}">${dish.name}</div>
            <div class="meal-actions">
                <button class="meal-action-btn reroll-meal" title="Đổi món khác">🎲</button>
                <button class="meal-action-btn delete-meal" title="Xóa món">🗑️</button>
            </div>
        `;

        // Event Listeners
        mealContent.querySelector('.reroll-meal').addEventListener('click', () => rerollMeal(date, type));
        mealContent.querySelector('.delete-meal').addEventListener('click', () => updateMealSchedule(date, type, null));
    } else {
        mealContent.innerHTML = `
            <button class="add-meal-btn" title="Thêm món">+</button>
        `;
        mealContent.querySelector('.add-meal-btn').addEventListener('click', () => rerollMeal(date, type));
    }

    slot.appendChild(mealContent);
    return slot;
}

function updateMealSchedule(date, type, dishId) {
    if (!schedule[date]) {
        schedule[date] = {};
    }

    if (dishId) {
        schedule[date][type] = dishId;
    } else {
        delete schedule[date][type];
        // Clean up empty dates
        if (Object.keys(schedule[date]).length === 0) {
            delete schedule[date];
        }
    }

    saveSchedule();
    renderSchedulePage();
}

function rerollMeal(date, type) {
    if (dishes.length === 0) {
        alert('Chưa có món ăn nào để gợi ý!');
        return;
    }

    // Try to find a dish that isn't the current one
    let newDish;
    let attempts = 0;
    const currentDishId = schedule[date]?.[type];

    do {
        newDish = dishes[Math.floor(Math.random() * dishes.length)];
        attempts++;
    } while (newDish.id === currentDishId && dishes.length > 1 && attempts < 5);

    updateMealSchedule(date, type, newDish.id);
}

function rollWeekSchedule() {
    if (dishes.length === 0) {
        alert('Chưa có món ăn nào để gợi ý! Hãy thêm món ăn trước.');
        return;
    }

    // Show animation overlay
    diceOverlay.classList.remove('hidden');

    // Animate for 1.5 seconds then generate
    setTimeout(() => {
        // Clear current week data for clean generation
        for (let i = 0; i < 7; i++) {
            const day = new Date(currentWeekStart);
            day.setDate(day.getDate() + i);
            const dateStr = formatDate(day);
            if (schedule[dateStr]) delete schedule[dateStr];
        }

        // Generate new schedule
        for (let i = 0; i < 7; i++) {
            const day = new Date(currentWeekStart);
            day.setDate(day.getDate() + i);
            const dateStr = formatDate(day);

            ['lunch', 'dinner'].forEach(type => {
                const randomDish = dishes[Math.floor(Math.random() * dishes.length)];
                if (!schedule[dateStr]) schedule[dateStr] = {};
                schedule[dateStr][type] = randomDish.id;
            });
        }

        saveSchedule();
        renderSchedulePage();

        // Hide overlay
        diceOverlay.classList.add('hidden');
    }, 1500);
}


function clearCurrentWeek() {
    if (confirm('Bạn có chắc chắn muốn xóa lịch ăn tuần này?')) {
        for (let i = 0; i < 7; i++) {
            const day = new Date(currentWeekStart);
            day.setDate(day.getDate() + i);
            const dateStr = formatDate(day);
            delete schedule[dateStr];
        }
        saveSchedule();
        renderSchedulePage();
    }
}
