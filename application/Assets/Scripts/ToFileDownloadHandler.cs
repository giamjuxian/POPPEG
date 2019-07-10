using System.IO;
using UnityEngine.Networking;

public class ToFileDownloadHandler : DownloadHandlerScript
{
    private int expected = -1;
    private int received = 0;
    private string filepath;
    private FileStream fileStream;
    private bool canceled = false;

    public ToFileDownloadHandler(byte[] buffer, string filepath)
      : base(buffer)
    {
        this.filepath = filepath;
        fileStream = new FileStream(filepath, FileMode.Create, FileAccess.Write);
    }

    protected override byte[] GetData() { return null; }

    protected override bool ReceiveData(byte[] data, int dataLength)
    {
        if (data == null || data.Length < 1)
        {
            return false;
        }
        received += dataLength;
        if (!canceled) fileStream.Write(data, 0, dataLength);
        return true;
    }

    protected override float GetProgress()
    {
        if (expected < 0) return 0;
        return (float)received / expected;
    }

    protected override void CompleteContent()
    {
        fileStream.Close();
    }

    protected override void ReceiveContentLength(int contentLength)
    {
        expected = contentLength;
    }

    public void Cancel()
    {
        canceled = true;
        fileStream.Close();
        File.Delete(filepath);
    }
}
