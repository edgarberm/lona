export default function setResizeCursor(angle: number) {
  const content = `
  <svg width="12" height="16" viewBox="0 0 12 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g transform="rotate(${angle} 6 8)">
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g transform="translate(-86.000000, -204.000000)">
            <g transform="translate(86.000000, 204.000000)">
                <path d="M6,0 L0,5.98 L4,5.98 L4,8 L4,10 L0,10 L6,16 L12,10 L8,10 L8,8 L8,5.98 L12,5.98 L6,0 Z M6,1.414 L9.586,4.981 L7,4.981 L7,7.501 L7,11 L9.586,11 L6,14.586 L2.414,11 L5,11 L5,7.501 L5,4.981 L2.414,4.981 L6,1.414 Z" id="cursor" fill="#FFFFFF"></path>
                <path d="M7,7.5 L7,4.98 L9.586,4.98 L6,1.414 L2.414,4.98 L5,4.98 L5,7.5 L5,11 L2.414,11 L6,14.586 L9.586,11 L7,11 L7,7.5 Z" id="cursor" fill="#000000"></path>
            </g>
        </g>
      </g>
    </g>
</svg>`

  return `url('data:image/svg+xml;utf8,${encodeURIComponent(content)}') 6 8, nesw-resize`
}
