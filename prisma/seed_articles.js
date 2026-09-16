import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const sampleArticles = [
  {
    id: 'bai-viet-01',
    slug: 'chien-luoc-dung-don-bay-tai-chinh-30-70',
    title: 'Chiến Lược Dùng Đòn Bẩy Tài Chính 30-70: Bí Quyết Không Lo Bị “Ngợp” Khi Lãi Suất Thả Nổi',
    excerpt: 'Hơn 80% nhà đầu tư thua lỗ trong các chu kỳ đóng băng không phải vì bất động sản xấu, mà vì tính toán sai dòng tiền chịu đựng khi hết ưu đãi lãi suất. Dưới đây là công thức 3 bước tôi áp dụng cho các thương vụ nhà phố triệu đô.',
    content: `
      <p class="lead-paragraph">
        Trong hơn 10 năm tư vấn và trực tiếp xuống tiền tại thị trường bất động sản trung tâm Quận 1, tôi nhận thấy một quy luật bất biến: <strong>Bất động sản không giết chết nhà đầu tư, chính đòn bẩy tài chính thiếu kiểm soát mới là thủ phạm</strong>.
      </p>

      <h3>1. Sai lầm phổ biến: Vay tối đa khi lãi suất đang rẻ</h3>
      <p>
        Giai đoạn thả nổi lãi suất luôn là "chiếc bẫy ngọt ngào" đối với những nhà đầu tư non tay. Khi ngân hàng chào mời gói vay ưu đãi 6.5% - 7.5% trong 12 tháng đầu, rất nhiều người đã mạnh dạn vay tới 70% thậm chí 80% giá trị tài sản. Nhưng họ quên mất một điều: <em>Sau 1 năm, lãi suất thả nổi có thể vọt lên 11% - 13.5%</em>.
      </p>

      <blockquote>
        "Đừng bao giờ dùng đòn bẩy tài chính để mua một tài sản không có khả năng tự tạo ra dòng tiền bù đắp ít nhất 50% tiền lãi ngân hàng mỗi tháng."
      </blockquote>

      <h3>2. Công thức "Bức Tường Lửa 30-70" An Toàn Tuyệt Đối</h3>
      <p>Để sống khỏe qua mọi chu kỳ kinh tế, chúng tôi luôn khuyến nghị khách hàng tuân thủ nguyên tắc 3 lớp:</p>
      <ul>
        <li><strong>Vốn tự có tối thiểu 40% - 50%:</strong> Chỉ vay tối đa 50% - 60% thay vì chạm trần 70%.</li>
        <li><strong>Quỹ dự phòng khẩn cấp 12 tháng:</strong> Luôn giữ riêng một khoản tiền gửi thanh khoản cao đủ trả gốc + lãi trong 1 năm dù nhà đất không cho thuê được.</li>
        <li><strong>Chọn tài sản có dòng tiền khai thác ngay:</strong> Ví dụ các căn nhà phố mặt tiền Bến Thành, Đa Kao đang có hợp đồng thuê sẵn từ 60 - 150 triệu/tháng. Dòng tiền này chính là chiếc phao cứu sinh vững chắc nhất.</li>
      </ul>

      <h3>3. Lời khuyên từ chuyên gia Bến Thành</h3>
      <p>
        Nếu bạn đang có ý định xuống tiền cho một bất động sản giá trị lớn, hãy liên hệ đội ngũ chuyên gia của chúng tôi để được thẩm định pháp lý và lập bảng phân tích dòng tiền chuyên sâu trước khi quyết định.
      </p>
    `,
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
    category: 'Đòn bẩy tài chính',
    author: 'Ngô Tuấn Kiệt - Trưởng Ban Tư Vấn',
    readTime: '7 phút đọc',
    views: 4820,
    isPublished: true,
    isFeatured: true,
    source: 'BĐS Bến Thành Thực Chiến',
  },
  {
    id: 'bai-viet-02',
    slug: 'kinh-nghiem-kiem-tra-quy-hoach-so-hong-nha-pho-quan-1',
    title: 'Kinh Nghiệm Kiểm Tra Quy Hoạch & Sổ Hồng Nhà Phố Quận 1 Trước Khi Xuống Tiền',
    excerpt: 'Những điểm mù chết người trong sổ hồng: Lộ giới ngầm, đất hành lang kỹ thuật, và ranh mốc biến động qua các thời kỳ chỉnh trang đô thị TP.HCM.',
    content: `
      <p class="lead-paragraph">
        Nhà phố Quận 1 có giá trị lên tới hàng chục, thậm chí hàng trăm tỷ đồng mỗi căn. Tuy nhiên, yếu tố lịch sử hình thành lâu đời khiến cho quy hoạch lộ giới và ranh mốc tại trung tâm Sài Gòn phức tạp hơn bất kỳ khu vực nào khác.
      </p>

      <h3>1. Kiểm tra phần diện tích công nhận vs diện tích thực tế</h3>
      <p>
        Rất nhiều căn nhà trên sổ ghi 80m² nhưng diện tích được công nhận xây dựng thực tế chỉ có 55m², phần còn lại thuộc lộ giới mở rộng đường hoặc hẻm. Nếu không kiểm tra kỹ bản vẽ trích lục địa chính tại Phòng Tài nguyên Môi trường, người mua rất dễ phải trả tiền cho phần diện tích không được phép xây dựng hoàn công.
      </p>

      <blockquote>
        "Giá trị của căn nhà phố trung tâm nằm ở diện tích công nhận và chỉ tiêu chiều cao xây dựng được cấp phép."
      </blockquote>

      <h3>2. Quy trình 3 bước thẩm định pháp lý trước khi đặt cọc</h3>
      <ol>
        <li>Tra cứu thông tin ngăn chặn giao dịch tại Văn phòng đăng ký đất đai.</li>
        <li>Đối chiếu tọa độ ranh góc mốc thực tế với bản đồ địa chính mới nhất.</li>
        <li>Xác minh tình trạng tranh chấp ranh giới với các hộ liền kề.</li>
      </ol>
    `,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    category: 'Pháp lý an toàn',
    author: 'Trần Minh Đức - Giám Đốc Thẩm Định',
    readTime: '6 phút đọc',
    views: 3150,
    isPublished: true,
    isFeatured: false,
    source: 'BĐS Bến Thành Thực Chiến',
  },
  {
    id: 'bai-viet-03',
    slug: 'phan-tich-chu-ky-bat-dong-san-trung-tam-2026-2030',
    title: 'Phân Tích Chu Kỳ BĐS Trung Tâm 2026 - 2030: Thời Khắc Vàng Của Dòng Tiền Thật',
    excerpt: 'Khi đầu cơ lướt sóng thoái trào, dòng vốn thông minh của giới tài phiệt đang âm thầm gom các tài sản lõi trung tâm có thanh khoản cao và dòng tiền khai thác bền vững.',
    content: `
      <p class="lead-paragraph">
        Lịch sử thị trường BĐS Việt Nam qua 4 chu kỳ lớn (1993, 2007, 2014, 2023) đã chứng minh một chân lý: <strong>Bất động sản lõi trung tâm luôn là tài sản phục hồi đầu tiên và thiết lập đỉnh giá mới sớm nhất</strong>.
      </p>

      <h3>1. Vì sao đất trung tâm Quận 1 không bao giờ giảm giá trị?</h3>
      <p>
        Quỹ đất Quận 1 là hữu hạn và gần như không thể mở rộng thêm. Trong khi đó, nhu cầu đặt trụ sở công ty, thương hiệu xa xỉ và chuỗi nhà hàng quốc tế luôn tập trung tại các cung đường kim cương như Đồng Khởi, Lê Lợi, Cách Mạng Tháng 8, Nguyễn Trãi...
      </p>

      <h3>2. Xu hướng chuyển dịch danh mục đầu tư</h3>
      <p>
        Giới tinh hoa hiện nay không còn mặn mà với đất nền phân lô vùng ven xa xôi không có người ở. Họ cơ cấu lại tài sản để gom nhà phố có sẵn hợp đồng thuê 5 - 10 năm với các thương hiệu lớn.
      </p>
    `,
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
    category: 'Phân tích chu kỳ',
    author: 'Ban Chuyên Gia Bến Thành',
    readTime: '8 phút đọc',
    views: 5210,
    isPublished: true,
    isFeatured: false,
    source: 'BĐS Bến Thành Thực Chiến',
  },
  {
    id: 'bai-viet-04',
    slug: '3-bai-hoc-xương-mau-ve-dat-coc-mua-ban-bds-trung-tam',
    title: '3 Bài Học Xương Máu Về Đặt Cọc Mua Bán BĐS Trung Tâm Mà Môi Giới Ít Khi Tiết Lộ',
    excerpt: 'Những điều khoản gài bẫy trong hợp đồng cọc tay, cách xử lý khi chủ nhà đổi ý hoặc tài sản dính diện phong tỏa thi hành án.',
    content: `
      <p class="lead-paragraph">
        Đặt cọc là bước đầu tiên nhưng cũng là nơi tiềm ẩn nhiều rủi ro mất tiền nhất trong một thương vụ mua bán nhà đất.
      </p>
      <h3>Bài học 1: Không bao giờ cọc khi chưa kiểm tra bản chính sổ hồng</h3>
      <p>Chỉ đặt cọc khi đã cầm tận tay, soi đèn kiểm tra phôi sổ hồng bản gốc và ký hợp đồng đặt cọc có công chứng viên làm chứng.</p>
      <h3>Bài học 2: Rõ ràng điều khoản phạt cọc và thời hạn công chứng</h3>
      <p>Ghi rõ nghĩa vụ thuế phí, thời gian bàn giao nhà và hiện trạng đồ đạc nội thất đi kèm trong hợp đồng.</p>
    `,
    image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80',
    category: 'Bài học đắt giá',
    author: 'Nguyễn Văn Tâm - Cố Vấn Pháp Lý',
    readTime: '5 phút đọc',
    views: 2940,
    isPublished: true,
    isFeatured: false,
    source: 'BĐS Bến Thành Thực Chiến',
  }
];

async function main() {
  console.log('Seeding initial articles...');
  for (const art of sampleArticles) {
    await prisma.article.upsert({
      where: { id: art.id },
      update: art,
      create: art,
    });
  }
  console.log(`Successfully seeded ${sampleArticles.length} articles!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
